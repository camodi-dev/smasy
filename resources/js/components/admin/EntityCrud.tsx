import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { router, useForm, usePage } from "@inertiajs/react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

type FieldType = "text" | "number" | "date" | "time" | "select" | "textarea";

interface FieldOption {
    value: string;
    label: string;
}

interface FieldConfig {
    name: string;
    label: string;
    type: FieldType;
    options?: FieldOption[];
    required?: boolean;
}

interface ColumnConfig {
    key: string;
    label: string;
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

interface FlashProps {
    flash?: {
        success?: string;
        error?: string;
    };
}

interface EntityCrudProps<T extends Record<string, string | number | null>> {
    title: string;
    description: string;
    routeBase: string;
    searchPlaceholder: string;
    records: PaginatedData<T>;
    columns: ColumnConfig[];
    fields: FieldConfig[];
    filters?: { search?: string };
}

function getInitialFormData(fields: FieldConfig[]): Record<string, string> {
    const data: Record<string, string> = {};
    fields.forEach((field, index) => {
        if (field.type === "select" && field.options?.length) {
            data[field.name] = field.options[0].value;
        } else {
            data[field.name] = "";
        }

        if (index === 0 && field.required && field.type === "text") {
            data[field.name] = "";
        }
    });
    return data;
}

export default function EntityCrud<T extends Record<string, string | number | null>>({
    title,
    description,
    routeBase,
    searchPlaceholder,
    records,
    columns,
    fields,
    filters,
}: EntityCrudProps<T>) {
    const { props } = usePage();
    const pageProps = props as FlashProps;
    const flash = pageProps.flash;

    const [search, setSearch] = useState(filters?.search ?? "");
    const [selected, setSelected] = useState<T | null>(null);
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const initialData = useMemo(() => getInitialFormData(fields), [fields]);
    const createForm = useForm(initialData);
    const editForm = useForm(initialData);

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        router.get(routeBase, { search }, { preserveState: true });
    }

    function openEdit(record: T) {
        setSelected(record);
        const nextData: Record<string, string> = {};
        fields.forEach((field) => {
            const value = record[field.name];
            nextData[field.name] = value === null || value === undefined ? "" : String(value);
        });
        editForm.setData(nextData);
        setShowEdit(true);
    }

    function openDelete(record: T) {
        setSelected(record);
        setShowDelete(true);
    }

    function submitCreate() {
        createForm.post(routeBase, {
            onSuccess: () => {
                setShowCreate(false);
                createForm.reset();
            },
        });
    }

    function submitEdit() {
        if (!selected) return;
        const id = selected.id;
        editForm.put(`${routeBase}/${id}`, {
            onSuccess: () => setShowEdit(false),
        });
    }

    function submitDelete() {
        if (!selected) return;
        const id = selected.id;
        router.delete(`${routeBase}/${id}`, {
            onSuccess: () => setShowDelete(false),
        });
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                        <p className="text-muted-foreground text-sm">{description}</p>
                    </div>
                    <Button onClick={() => setShowCreate(true)} className="gap-2">
                        <Plus className="w-4 h-4" /> Add {title.slice(0, -1)}
                    </Button>
                </div>

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
                            placeholder={searchPlaceholder}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Button type="submit" variant="outline">Search</Button>
                </form>

                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border bg-muted/50">
                                        {columns.map((column) => (
                                            <th key={column.key} className="text-left px-4 py-3 font-medium text-muted-foreground">{column.label}</th>
                                        ))}
                                        <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={columns.length + 1} className="text-center py-12 text-muted-foreground">
                                                No records found.
                                            </td>
                                        </tr>
                                    ) : (
                                        records.data.map((record) => (
                                            <tr key={String(record.id)} className="border-b border-border hover:bg-muted/30 transition-colors">
                                                {columns.map((column) => (
                                                    <td key={column.key} className="px-4 py-3">{String(record[column.key] ?? "—")}</td>
                                                ))}
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button variant="ghost" size="icon" onClick={() => openEdit(record)}>
                                                            <Pencil className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-destructive hover:text-destructive"
                                                            onClick={() => openDelete(record)}
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

                        {records.last_page > 1 && (
                            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                                <p className="text-sm text-muted-foreground">
                                    Showing {((records.current_page - 1) * records.per_page) + 1} to{" "}
                                    {Math.min(records.current_page * records.per_page, records.total)} of{" "}
                                    {records.total} results
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={records.current_page === 1}
                                        onClick={() => router.get(routeBase, { page: records.current_page - 1, search })}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={records.current_page === records.last_page}
                                        onClick={() => router.get(routeBase, { page: records.current_page + 1, search })}
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
                        <DialogTitle>Add {title.slice(0, -1)}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        {fields.map((field) => (
                            <div className="space-y-1.5" key={field.name}>
                                <Label>{field.label}</Label>
                                {field.type === "select" ? (
                                    <select
                                        className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                                        value={createForm.data[field.name]}
                                        onChange={(e) => createForm.setData(field.name, e.target.value)}
                                    >
                                        {(field.options ?? []).map((option) => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                ) : field.type === "textarea" ? (
                                    <textarea
                                        className="w-full min-h-[90px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={createForm.data[field.name]}
                                        onChange={(e) => createForm.setData(field.name, e.target.value)}
                                    />
                                ) : (
                                    <Input
                                        type={field.type}
                                        value={createForm.data[field.name]}
                                        onChange={(e) => createForm.setData(field.name, e.target.value)}
                                    />
                                )}
                                {createForm.errors[field.name] && <p className="text-xs text-destructive">{createForm.errors[field.name]}</p>}
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
                        <Button onClick={submitCreate} disabled={createForm.processing}>
                            {createForm.processing ? "Creating..." : "Create"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showEdit} onOpenChange={setShowEdit}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit {title.slice(0, -1)}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        {fields.map((field) => (
                            <div className="space-y-1.5" key={field.name}>
                                <Label>{field.label}</Label>
                                {field.type === "select" ? (
                                    <select
                                        className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                                        value={editForm.data[field.name]}
                                        onChange={(e) => editForm.setData(field.name, e.target.value)}
                                    >
                                        {(field.options ?? []).map((option) => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                ) : field.type === "textarea" ? (
                                    <textarea
                                        className="w-full min-h-[90px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={editForm.data[field.name]}
                                        onChange={(e) => editForm.setData(field.name, e.target.value)}
                                    />
                                ) : (
                                    <Input
                                        type={field.type}
                                        value={editForm.data[field.name]}
                                        onChange={(e) => editForm.setData(field.name, e.target.value)}
                                    />
                                )}
                                {editForm.errors[field.name] && <p className="text-xs text-destructive">{editForm.errors[field.name]}</p>}
                            </div>
                        ))}
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
                        <AlertDialogTitle>Delete Record</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={submitDelete}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    );
}
