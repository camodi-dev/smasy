import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { router, useForm, usePage } from "@inertiajs/react";
import { Plus, Search, Pencil, Trash2, Building2, BookOpen } from "lucide-react";
import { useState } from "react";

interface Faculty {
    id: number;
    name: string;
    code: string;
    description: string | null;
    departments_count: number;
    created_at: string;
}

interface Props {
    faculties: {
        data: Faculty[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
    };
    filters: { search?: string };
}

export default function Faculties({ faculties, filters }: Props) {
    const { props } = usePage<{ flash: { success?: string; error?: string } }>();
    const flash = props.flash;

    const [search, setSearch] = useState(filters.search ?? '');
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [selected, setSelected] = useState<Faculty | null>(null);

    const createForm = useForm({ name: '', code: '', description: '' });
    const editForm   = useForm({ name: '', code: '', description: '' });

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        router.get('/admin/faculties', { search }, { preserveState: true });
    }

    function openEdit(faculty: Faculty) {
        setSelected(faculty);
        editForm.setData({ name: faculty.name, code: faculty.code, description: faculty.description ?? '' });
        setShowEdit(true);
    }

    function openDelete(faculty: Faculty) {
        setSelected(faculty);
        setShowDelete(true);
    }

    function submitCreate() {
        createForm.post('/admin/faculties', {
            onSuccess: () => { setShowCreate(false); createForm.reset(); }
        });
    }

    function submitEdit() {
        if (!selected) return;
        editForm.put(`/admin/faculties/${selected.id}`, {
            onSuccess: () => setShowEdit(false),
        });
    }

    function submitDelete() {
        if (!selected) return;
        router.delete(`/admin/faculties/${selected.id}`, {
            onSuccess: () => setShowDelete(false),
        });
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Faculties</h1>
                        <p className="text-muted-foreground text-sm">
                            Manage your institute's faculties
                        </p>
                    </div>
                    <Button onClick={() => setShowCreate(true)} className="gap-2">
                        <Plus className="w-4 h-4" /> Add Faculty
                    </Button>
                </div>

                {/* Flash messages */}
                {flash?.success && (
                    <div className="rounded-md bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-600">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                        {flash.error}
                    </div>
                )}

                {/* Search */}
                <form onSubmit={handleSearch} className="flex gap-2 max-w-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search faculties..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Button type="submit" variant="outline">Search</Button>
                </form>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Faculties
                            </CardTitle>
                            <Building2 className="w-4 h-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{faculties.total}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Departments
                            </CardTitle>
                            <BookOpen className="w-4 h-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">
                                {faculties.data.reduce((acc, f) => acc + f.departments_count, 0)}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Table */}
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border bg-muted/50">
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Code</th>
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Departments</th>
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Description</th>
                                        <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {faculties.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center py-12 text-muted-foreground">
                                                No faculties found. Create your first one!
                                            </td>
                                        </tr>
                                    ) : (
                                        faculties.data.map((faculty) => (
                                            <tr key={faculty.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                                                <td className="px-4 py-3 font-medium">{faculty.name}</td>
                                                <td className="px-4 py-3">
                                                    <Badge variant="outline">{faculty.code}</Badge>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge>{faculty.departments_count} dept{faculty.departments_count !== 1 ? 's' : ''}</Badge>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">
                                                    {faculty.description ?? '—'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => openEdit(faculty)}
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-destructive hover:text-destructive"
                                                            onClick={() => openDelete(faculty)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {faculties.last_page > 1 && (
                            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                                <p className="text-sm text-muted-foreground">
                                    Showing {((faculties.current_page - 1) * faculties.per_page) + 1} to{" "}
                                    {Math.min(faculties.current_page * faculties.per_page, faculties.total)} of{" "}
                                    {faculties.total} results
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={faculties.current_page === 1}
                                        onClick={() => router.get('/admin/faculties', { page: faculties.current_page - 1, search })}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={faculties.current_page === faculties.last_page}
                                        onClick={() => router.get('/admin/faculties', { page: faculties.current_page + 1, search })}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

            </div>

            {/* Create Dialog */}
            <Dialog open={showCreate} onOpenChange={setShowCreate}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Faculty</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label>Name</Label>
                            <Input
                                placeholder="e.g. Faculty of Science"
                                value={createForm.data.name}
                                onChange={(e) => createForm.setData('name', e.target.value)}
                            />
                            {createForm.errors.name && <p className="text-xs text-destructive">{createForm.errors.name}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label>Code</Label>
                            <Input
                                placeholder="e.g. FSC"
                                value={createForm.data.code}
                                onChange={(e) => createForm.setData('code', e.target.value.toUpperCase())}
                            />
                            {createForm.errors.code && <p className="text-xs text-destructive">{createForm.errors.code}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label>Description <span className="text-muted-foreground">(optional)</span></Label>
                            <Input
                                placeholder="Brief description..."
                                value={createForm.data.description}
                                onChange={(e) => createForm.setData('description', e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
                        <Button onClick={submitCreate} disabled={createForm.processing}>
                            {createForm.processing ? 'Creating...' : 'Create Faculty'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={showEdit} onOpenChange={setShowEdit}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Faculty</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label>Name</Label>
                            <Input
                                value={editForm.data.name}
                                onChange={(e) => editForm.setData('name', e.target.value)}
                            />
                            {editForm.errors.name && <p className="text-xs text-destructive">{editForm.errors.name}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label>Code</Label>
                            <Input
                                value={editForm.data.code}
                                onChange={(e) => editForm.setData('code', e.target.value.toUpperCase())}
                            />
                            {editForm.errors.code && <p className="text-xs text-destructive">{editForm.errors.code}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label>Description <span className="text-muted-foreground">(optional)</span></Label>
                            <Input
                                value={editForm.data.description}
                                onChange={(e) => editForm.setData('description', e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEdit(false)}>Cancel</Button>
                        <Button onClick={submitEdit} disabled={editForm.processing}>
                            {editForm.processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Faculty</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <strong>{selected?.name}</strong>?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive hover:bg-destructive/90"
                            onClick={submitDelete}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </DashboardLayout>
    );
}