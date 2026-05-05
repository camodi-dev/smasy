import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { router, useForm, usePage } from "@inertiajs/react";
import { Plus, Search, Pencil, Trash2, Building2, Users, BookOpen } from "lucide-react";
import { useState } from "react";

interface Faculty {
    id: number;
    name: string;
    code: string;
}

interface Department {
    id: number;
    name: string;
    code: string;
    description: string | null;
    students_count: number;
    courses_count: number;
    faculty: Faculty;
}

interface Props {
    departments: {
        data: Department[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
    };
    faculties: Faculty[];
    filters: { search?: string };
}

interface FlashProps {
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Departments({ departments, faculties, filters }: Props) {
    const { props } = usePage();
    const pageProps = props as FlashProps;
    const flash = pageProps.flash;

    const [search, setSearch] = useState(filters.search ?? "");
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [selected, setSelected] = useState<Department | null>(null);

    const createForm = useForm({
        faculty_id: faculties[0]?.id?.toString() ?? "",
        name: "",
        code: "",
        description: "",
    });

    const editForm = useForm({
        faculty_id: "",
        name: "",
        code: "",
        description: "",
    });

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        router.get("/admin/departments", { search }, { preserveState: true });
    }

    function openEdit(department: Department) {
        setSelected(department);
        editForm.setData({
            faculty_id: department.faculty.id.toString(),
            name: department.name,
            code: department.code,
            description: department.description ?? "",
        });
        setShowEdit(true);
    }

    function openDelete(department: Department) {
        setSelected(department);
        setShowDelete(true);
    }

    function submitCreate() {
        createForm.post("/admin/departments", {
            onSuccess: () => {
                setShowCreate(false);
                createForm.reset();
                createForm.setData("faculty_id", faculties[0]?.id?.toString() ?? "");
            },
        });
    }

    function submitEdit() {
        if (!selected) return;
        editForm.put(`/admin/departments/${selected.id}`, {
            onSuccess: () => setShowEdit(false),
        });
    }

    function submitDelete() {
        if (!selected) return;
        router.delete(`/admin/departments/${selected.id}`, {
            onSuccess: () => setShowDelete(false),
        });
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Departments</h1>
                        <p className="text-muted-foreground text-sm">
                            Manage departments under faculties
                        </p>
                    </div>
                    <Button onClick={() => setShowCreate(true)} className="gap-2" disabled={faculties.length === 0}>
                        <Plus className="w-4 h-4" /> Add Department
                    </Button>
                </div>

                {faculties.length === 0 && (
                    <div className="rounded-md bg-amber-500/10 border border-amber-500/20 px-4 py-3 text-sm text-amber-700">
                        Create at least one faculty before adding departments.
                    </div>
                )}

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

                <form onSubmit={handleSearch} className="flex gap-2 max-w-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search departments..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Button type="submit" variant="outline">Search</Button>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Departments</CardTitle>
                            <Building2 className="w-4 h-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{departments.total}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
                            <Users className="w-4 h-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">
                                {departments.data.reduce((acc, department) => acc + department.students_count, 0)}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Courses</CardTitle>
                            <BookOpen className="w-4 h-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">
                                {departments.data.reduce((acc, department) => acc + department.courses_count, 0)}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border bg-muted/50">
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Code</th>
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Faculty</th>
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Students</th>
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Courses</th>
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Description</th>
                                        <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {departments.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="text-center py-12 text-muted-foreground">
                                                No departments found. Create your first one!
                                            </td>
                                        </tr>
                                    ) : (
                                        departments.data.map((department) => (
                                            <tr key={department.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                                                <td className="px-4 py-3 font-medium">{department.name}</td>
                                                <td className="px-4 py-3">
                                                    <Badge variant="outline">{department.code}</Badge>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge>{department.faculty.name}</Badge>
                                                </td>
                                                <td className="px-4 py-3">{department.students_count}</td>
                                                <td className="px-4 py-3">{department.courses_count}</td>
                                                <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">
                                                    {department.description ?? "—"}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => openEdit(department)}
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-destructive hover:text-destructive"
                                                            onClick={() => openDelete(department)}
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

                        {departments.last_page > 1 && (
                            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                                <p className="text-sm text-muted-foreground">
                                    Showing {((departments.current_page - 1) * departments.per_page) + 1} to{" "}
                                    {Math.min(departments.current_page * departments.per_page, departments.total)} of{" "}
                                    {departments.total} results
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={departments.current_page === 1}
                                        onClick={() => router.get("/admin/departments", { page: departments.current_page - 1, search })}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={departments.current_page === departments.last_page}
                                        onClick={() => router.get("/admin/departments", { page: departments.current_page + 1, search })}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={showCreate} onOpenChange={setShowCreate}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Department</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label>Faculty</Label>
                            <select
                                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                                value={createForm.data.faculty_id}
                                onChange={(e) => createForm.setData("faculty_id", e.target.value)}
                            >
                                {faculties.map((faculty) => (
                                    <option key={faculty.id} value={faculty.id}>
                                        {faculty.name} ({faculty.code})
                                    </option>
                                ))}
                            </select>
                            {createForm.errors.faculty_id && <p className="text-xs text-destructive">{createForm.errors.faculty_id}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label>Name</Label>
                            <Input
                                placeholder="e.g. Computer Science"
                                value={createForm.data.name}
                                onChange={(e) => createForm.setData("name", e.target.value)}
                            />
                            {createForm.errors.name && <p className="text-xs text-destructive">{createForm.errors.name}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label>Code</Label>
                            <Input
                                placeholder="e.g. CSC"
                                value={createForm.data.code}
                                onChange={(e) => createForm.setData("code", e.target.value.toUpperCase())}
                            />
                            {createForm.errors.code && <p className="text-xs text-destructive">{createForm.errors.code}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label>Description <span className="text-muted-foreground">(optional)</span></Label>
                            <Input
                                placeholder="Brief description..."
                                value={createForm.data.description}
                                onChange={(e) => createForm.setData("description", e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
                        <Button onClick={submitCreate} disabled={createForm.processing || faculties.length === 0}>
                            {createForm.processing ? "Creating..." : "Create Department"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showEdit} onOpenChange={setShowEdit}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Department</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label>Faculty</Label>
                            <select
                                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                                value={editForm.data.faculty_id}
                                onChange={(e) => editForm.setData("faculty_id", e.target.value)}
                            >
                                {faculties.map((faculty) => (
                                    <option key={faculty.id} value={faculty.id}>
                                        {faculty.name} ({faculty.code})
                                    </option>
                                ))}
                            </select>
                            {editForm.errors.faculty_id && <p className="text-xs text-destructive">{editForm.errors.faculty_id}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label>Name</Label>
                            <Input
                                value={editForm.data.name}
                                onChange={(e) => editForm.setData("name", e.target.value)}
                            />
                            {editForm.errors.name && <p className="text-xs text-destructive">{editForm.errors.name}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label>Code</Label>
                            <Input
                                value={editForm.data.code}
                                onChange={(e) => editForm.setData("code", e.target.value.toUpperCase())}
                            />
                            {editForm.errors.code && <p className="text-xs text-destructive">{editForm.errors.code}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label>Description <span className="text-muted-foreground">(optional)</span></Label>
                            <Input
                                value={editForm.data.description}
                                onChange={(e) => editForm.setData("description", e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEdit(false)}>Cancel</Button>
                        <Button onClick={submitEdit} disabled={editForm.processing}>
                            {editForm.processing ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Department</AlertDialogTitle>
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
