"use client";

import * as React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, getDocs, doc, deleteDoc, addDoc, Timestamp } from "firebase/firestore";
import { useAuth } from "@/components/auth-provider";
import { Loader2, Check, X, Inbox, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { deleteImageFromStorage, uploadImage } from "@/lib/storage-service";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { syncPoemToAlgolia } from "@/lib/actions";

type Submission = {
    id: string;
    title: string;
    poem: string;
    author: string;
    category: string;
    imageUrl?: string;
    submittedAt: Timestamp;
};

type Category = {
    id: string;
    name: string;
};

const ModerationPage = () => {
    // Si estamos en producción, esta página no estará disponible.
    if (process.env.NODE_ENV === 'production') {
        return null;
    }

    const { isAdmin, user } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [submissions, setSubmissions] = React.useState<Submission[]>([]);
    const [loading, setLoading] = React.useState(true);
    
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [currentSubmission, setCurrentSubmission] = React.useState<Submission | null>(null);
    const [editedData, setEditedData] = React.useState<Partial<Submission>>({});
    const [newImageFile, setNewImageFile] = React.useState<File | null>(null);
    const [poemCategories, setPoemCategories] = React.useState<Category[]>([]);

    React.useEffect(() => {
        if (user && !isAdmin) {
            router.push('/');
        }
    }, [isAdmin, user, router]);

    React.useEffect(() => {
        const fetchData = async () => {
            if (!isAdmin) return;
            setLoading(true);
            try {
                const submissionsCollection = collection(db, 'submissions');
                const qSubs = query(submissionsCollection, orderBy('submittedAt', 'asc'));
                const subsSnapshot = await getDocs(qSubs);
                const fetchedSubmissions = subsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Submission[];
                setSubmissions(fetchedSubmissions);

                const categoriesCollection = collection(db, 'categories');
                const qCats = query(categoriesCollection, where('type', '==', 'poema'));
                const catsSnapshot = await getDocs(qCats);
                const fetchedCategories = catsSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name })) as Category[];
                setPoemCategories(fetchedCategories);

            } catch (error) {
                console.error("Error fetching data:", error);
                toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar los datos." });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [isAdmin, toast]);

    const handleEditClick = (submission: Submission) => {
        setCurrentSubmission(submission);
        setEditedData(submission);
        setNewImageFile(null);
        setIsEditModalOpen(true);
    };

    const handleSaveChanges = async () => {
        if (!currentSubmission || !editedData) return;

        let finalImageUrl = editedData.imageUrl;

        if (newImageFile) {
            const toastId = toast({ title: "Subiendo nueva imagen..." }).id;
            try {
                if (currentSubmission.imageUrl) {
                    await deleteImageFromStorage(currentSubmission.imageUrl);
                }
                const fileName = `submitted-images/${currentSubmission.id}-${newImageFile.name}`;
                finalImageUrl = await uploadImage(newImageFile, fileName);
                toast({ id: toastId, title: "Éxito", description: "Imagen reemplazada." });
            } catch (error) {
                toast({ id: toastId, variant: "destructive", title: "Error", description: "No se pudo subir la nueva imagen." });
                return;
            }
        }
        
        const updatedSubmission = { ...currentSubmission, ...editedData, imageUrl: finalImageUrl };

        setSubmissions(submissions.map(s => s.id === updatedSubmission.id ? updatedSubmission : s));
        
        setIsEditModalOpen(false);
        toast({ title: "Cambios Guardados", description: "Los cambios se han guardado temporalmente. Aprueba el poema para publicarlos." });
    };

    const handleApprove = async (submission: Submission) => {
        try {
            const poemsCollection = collection(db, 'poems');
            const newPoemData = {
                title: submission.title,
                poem: submission.poem,
                category: submission.category,
                author: submission.author,
                imageUrl: submission.imageUrl || null,
                createdAt: submission.submittedAt,
                likes: 0,
            };
            const docRef = await addDoc(poemsCollection, newPoemData);

            await syncPoemToAlgolia({
                objectID: docRef.id,
                ...newPoemData,
                createdAt: newPoemData.createdAt.toMillis(),
            });

            await deleteDoc(doc(db, "submissions", submission.id));
            setSubmissions(prev => prev.filter(s => s.id !== submission.id));
            toast({ title: "Poema Aprobado", description: `"${submission.title}" ahora es público.` });

        } catch (error) {
            console.error("Error approving submission:", error);
            toast({ variant: "destructive", title: "Error", description: "No se pudo aprobar el poema." });
        }
    };

    const handleDelete = async (submission: Submission) => {
        try {
            if (submission.imageUrl) {
                await deleteImageFromStorage(submission.imageUrl);
            }
            await deleteDoc(doc(db, "submissions", submission.id));
            setSubmissions(prev => prev.filter(s => s.id !== submission.id));
            toast({ title: "Envío Eliminado", description: "El poema ha sido rechazado y eliminado." });
        } catch (error) {
            console.error("Error deleting submission:", error);
            toast({ variant: "destructive", title: "Error", description: "No se pudo eliminar el envío." });
        }
    };

    if (!isAdmin) {
        return <MainLayout><div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div></MainLayout>;
    }

    return (
        <MainLayout>
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-4xl font-headline text-primary mb-8 text-center">Moderar Poemas</h1>
                {loading ? (
                    <div className="text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>
                ) : submissions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {submissions.map(sub => (
                            <Card key={sub.id} className="flex flex-col">
                                {sub.imageUrl && (
                                    <div className="relative w-full aspect-video">
                                        <Image src={sub.imageUrl} alt={sub.title} fill className="object-cover rounded-t-lg" />
                                    </div>
                                )}
                                <CardHeader>
                                    <CardTitle>{sub.title}</CardTitle>
                                    <CardDescription>
                                        Enviado por: {sub.author} <br/>
                                        Categoría: <Badge variant="secondary">{sub.category}</Badge>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <p className="whitespace-pre-wrap text-sm">{sub.poem}</p>
                                </CardContent>
                                <CardFooter className="flex justify-end gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => handleEditClick(sub)}>
                                        <Pencil className="h-4 w-4 mr-2"/> Editar
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleDelete(sub)}>
                                        <X className="h-4 w-4 mr-2"/> Rechazar
                                    </Button>
                                    <Button size="sm" onClick={() => handleApprove(sub)}>
                                        <Check className="h-4 w-4 mr-2"/> Aprobar
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed rounded-lg">
                        <Inbox className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-semibold">Bandeja de entrada vacía</h3>
                        <p className="mt-1 text-sm text-gray-500">No hay nuevos poemas para moderar.</p>
                    </div>
                )}
            </div>

            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Editar Poema Enviado</DialogTitle>
                        <DialogDescription>
                            Realiza los cambios necesarios antes de aprobar el poema.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                        <div className="space-y-2">
                            <Label htmlFor="edit-title">Título</Label>
                            <Input id="edit-title" value={editedData.title || ''} onChange={(e) => setEditedData({...editedData, title: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-author">Autor</Label>
                            <Input id="edit-author" value={editedData.author || ''} onChange={(e) => setEditedData({...editedData, author: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-category">Categoría</Label>
                            <Select value={editedData.category} onValueChange={(value) => setEditedData({...editedData, category: value})}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {poemCategories.map(cat => <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-poem">Poema</Label>
                            <Textarea id="edit-poem" value={editedData.poem || ''} onChange={(e) => setEditedData({...editedData, poem: e.target.value})} rows={12} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-image">Imagen</Label>
                            {editedData.imageUrl && !newImageFile && <Image src={editedData.imageUrl} alt="Imagen actual" width={200} height={100} className="rounded-md object-cover" />}
                            <Input id="edit-image" type="file" accept="image/*" onChange={(e) => e.target.files && setNewImageFile(e.target.files[0])} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSaveChanges}>Guardar Cambios</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </MainLayout>
    );
}

export default ModerationPage;
