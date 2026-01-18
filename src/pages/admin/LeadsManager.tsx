import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Mail, Phone, MapPin, Calendar, Filter, Edit, Save, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Lead {
    id: string;
    created_at: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    message: string;
    status: string;
    priority: string;
    notes: string | null;
    country_code?: string;
    country_iso2?: string;
}

const statusColors: Record<string, string> = {
    new: "bg-blue-500",
    contacted: "bg-yellow-500",
    qualified: "bg-purple-500",
    proposal_sent: "bg-orange-500",
    won: "bg-green-500",
    lost: "bg-gray-500",
};

const statusLabels: Record<string, string> = {
    new: "New",
    contacted: "Contacted",
    qualified: "Qualified",
    proposal_sent: "Proposal Sent",
    won: "Won",
    lost: "Lost",
};

export const LeadsManager = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedNotes, setEditedNotes] = useState("");
    const [editedPriority, setEditedPriority] = useState("");
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteConfirmName, setDeleteConfirmName] = useState("");
    const { toast } = useToast();

    const getFlagEmoji = (iso2: string) => {
        if (!iso2) return "";
        if (iso2 === "UN") return "🌍";
        const codePoints = iso2
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt(0));
        return String.fromCodePoint(...codePoints);
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("leads")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setLeads(data || []);
        } catch (error) {
            console.error("Error fetching leads:", error);
            toast({
                title: "Error",
                description: "Failed to fetch leads",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const updateLeadStatus = async (leadId: string, newStatus: string) => {
        try {
            const { error } = await (supabase
                .from("leads")
                .update({
                    status: newStatus,
                    last_contacted_at: newStatus !== 'new' ? new Date().toISOString() : null
                } as any)
                .eq("id", leadId) as any);

            if (error) throw error;

            toast({
                title: "Success",
                description: "Lead status updated",
            });

            fetchLeads();
        } catch (error) {
            console.error("Error updating lead:", error);
            toast({
                title: "Error",
                description: "Failed to update lead status",
                variant: "destructive",
            });
        }
    };

    const updateLeadDetails = async () => {
        if (!selectedLead) return;

        try {
            const { error } = await (supabase
                .from("leads")
                .update({
                    notes: editedNotes,
                    priority: editedPriority,
                } as any)
                .eq("id", selectedLead.id) as any);

            if (error) throw error;

            toast({
                title: "Success",
                description: "Lead details updated",
            });

            setIsEditing(false);
            fetchLeads();
            setSelectedLead(null);
        } catch (error) {
            console.error("Error updating lead:", error);
            toast({
                title: "Error",
                description: "Failed to update lead details",
                variant: "destructive",
            });
        }
    };

    const deleteLead = async () => {
        if (!selectedLead) return;

        try {
            const { error } = await (supabase
                .from("leads")
                .delete()
                .eq("id", selectedLead.id) as any);

            if (error) throw error;

            toast({
                title: "Success",
                description: "Lead deleted successfully",
            });

            setShowDeleteDialog(false);
            setDeleteConfirmName("");
            setSelectedLead(null);
            fetchLeads();
        } catch (error) {
            console.error("Error deleting lead:", error);
            toast({
                title: "Error",
                description: "Failed to delete lead",
                variant: "destructive",
            });
        }
    };

    const handleOpenLead = (lead: Lead, editMode: boolean = false) => {
        setSelectedLead(lead);
        setIsEditing(editMode);
        setEditedNotes(lead.notes || "");
        setEditedPriority(lead.priority);
    };

    const filteredLeads = filterStatus === "all"
        ? leads
        : leads.filter(lead => lead.status === filterStatus);

    const stats = {
        total: leads.length,
        new: leads.filter(l => l.status === 'new').length,
        contacted: leads.filter(l => l.status === 'contacted').length,
        won: leads.filter(l => l.status === 'won').length,
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-serif font-medium mb-2">Leads</h1>
                    <p className="text-muted-foreground">
                        Manage and track all contact form enquiries
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-4">
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <div className="text-sm text-muted-foreground">Total Leads</div>
                    </Card>
                    <Card className="p-4">
                        <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
                        <div className="text-sm text-muted-foreground">New</div>
                    </Card>
                    <Card className="p-4">
                        <div className="text-2xl font-bold text-yellow-600">{stats.contacted}</div>
                        <div className="text-sm text-muted-foreground">Contacted</div>
                    </Card>
                    <Card className="p-4">
                        <div className="text-2xl font-bold text-green-600">{stats.won}</div>
                        <div className="text-sm text-muted-foreground">Won</div>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="p-4">
                    <div className="flex items-center gap-4">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Leads</SelectItem>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="contacted">Contacted</SelectItem>
                                <SelectItem value="qualified">Qualified</SelectItem>
                                <SelectItem value="proposal_sent">Proposal Sent</SelectItem>
                                <SelectItem value="won">Won</SelectItem>
                                <SelectItem value="lost">Lost</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </Card>

                {/* Leads Table */}
                <Card>
                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                        </div>
                    ) : filteredLeads.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">
                            No leads found
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredLeads.map((lead) => (
                                        <TableRow key={lead.id} className="cursor-pointer hover:bg-muted/50">
                                            <TableCell className="font-medium">{lead.name}</TableCell>
                                            <TableCell>
                                                <div className="space-y-1 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="w-3 h-3 text-muted-foreground" />
                                                        <a href={`mailto:${lead.email}`} className="hover:underline">
                                                            {lead.email}
                                                        </a>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-3 h-3 text-muted-foreground" />
                                                        <a href={`tel:${lead.country_code || '+91'}${lead.phone}`} className="hover:underline flex items-center gap-1">
                                                            <span>{getFlagEmoji(lead.country_iso2 || 'IN')}</span>
                                                            {lead.country_code || "+91"} {lead.phone}
                                                        </a>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <MapPin className="w-3 h-3 text-muted-foreground" />
                                                    {lead.location}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    value={lead.status}
                                                    onValueChange={(value) => updateLeadStatus(lead.id, value)}
                                                >
                                                    <SelectTrigger className="w-[140px]">
                                                        <Badge className={statusColors[lead.status]}>
                                                            {statusLabels[lead.status]}
                                                        </Badge>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.entries(statusLabels).map(([value, label]) => (
                                                            <SelectItem key={value} value={value}>
                                                                {label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(lead.created_at).toLocaleDateString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleOpenLead(lead, false)}
                                                    >
                                                        View
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleOpenLead(lead, true)}
                                                    >
                                                        <Edit className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </Card>

                {/* Lead Detail/Edit Modal */}
                {selectedLead && (
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => { setSelectedLead(null); setIsEditing(false); }}
                    >
                        <Card
                            className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-serif font-medium">{selectedLead.name}</h2>
                                        <Badge className={`${statusColors[selectedLead.status]} mt-2`}>
                                            {statusLabels[selectedLead.status]}
                                        </Badge>
                                    </div>
                                    <Button variant="ghost" onClick={() => { setSelectedLead(null); setIsEditing(false); }}>
                                        ✕
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <div className="text-sm font-medium text-muted-foreground mb-1">Email</div>
                                        <a href={`mailto:${selectedLead.email}`} className="hover:underline">
                                            {selectedLead.email}
                                        </a>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-muted-foreground mb-1">Phone</div>
                                        <a href={`tel:${selectedLead.country_code || '+91'}${selectedLead.phone}`} className="hover:underline flex items-center gap-2">
                                            <span className="text-xl">{getFlagEmoji(selectedLead.country_iso2 || 'IN')}</span>
                                            {selectedLead.country_code || "+91"} {selectedLead.phone}
                                        </a>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-muted-foreground mb-1">Location</div>
                                        <div>{selectedLead.location}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-muted-foreground mb-1">Message</div>
                                        <div className="p-3 bg-muted rounded-md whitespace-pre-wrap">
                                            {selectedLead.message}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-muted-foreground mb-1">Priority</div>
                                        {isEditing ? (
                                            <Select value={editedPriority} onValueChange={setEditedPriority}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="low">Low</SelectItem>
                                                    <SelectItem value="medium">Medium</SelectItem>
                                                    <SelectItem value="high">High</SelectItem>
                                                    <SelectItem value="urgent">Urgent</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <div className="capitalize">{selectedLead.priority}</div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-muted-foreground mb-1">Notes</div>
                                        {isEditing ? (
                                            <Textarea
                                                value={editedNotes}
                                                onChange={(e) => setEditedNotes(e.target.value)}
                                                placeholder="Add notes about this lead..."
                                                rows={4}
                                                className="resize-none"
                                            />
                                        ) : (
                                            <div className="p-3 bg-muted rounded-md whitespace-pre-wrap">
                                                {selectedLead.notes || "No notes"}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-muted-foreground mb-1">Received</div>
                                        <div>{new Date(selectedLead.created_at).toLocaleString()}</div>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-4 border-t">
                                    {isEditing ? (
                                        <>
                                            <Button
                                                onClick={updateLeadDetails}
                                                className="flex-1"
                                            >
                                                <Save className="w-4 h-4 mr-2" />
                                                Save Changes
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => setIsEditing(false)}
                                            >
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                variant="outline"
                                                onClick={() => setIsEditing(true)}
                                                className="flex-1"
                                            >
                                                <Edit className="w-4 h-4 mr-2" />
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={() => setShowDeleteDialog(true)}
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Lead?</AlertDialogTitle>
                            <AlertDialogDescription className="space-y-3">
                                <p>
                                    This action cannot be undone. This will permanently delete the lead from {selectedLead?.name}.
                                </p>
                                <p className="font-medium">
                                    Type <span className="text-destructive font-semibold">{selectedLead?.name}</span> to confirm:
                                </p>
                                <Input
                                    value={deleteConfirmName}
                                    onChange={(e) => setDeleteConfirmName(e.target.value)}
                                    placeholder="Type lead name here"
                                    className="font-mono"
                                />
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDeleteConfirmName("")}>
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={deleteLead}
                                disabled={deleteConfirmName !== selectedLead?.name}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AdminLayout>
    );
};
