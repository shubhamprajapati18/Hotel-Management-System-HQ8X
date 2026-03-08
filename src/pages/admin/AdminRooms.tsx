import { AdminLayout } from "@/components/AdminLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Upload, ImageIcon } from "lucide-react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { rooms as staticRooms } from "@/data/rooms";

interface RoomFormData {
  name: string;
  category: string;
  description: string;
  price: number;
  size: string;
  capacity: number;
  amenities: string;
  status: string;
}

const defaultForm: RoomFormData = {
  name: "",
  category: "Deluxe",
  description: "",
  price: 0,
  size: "",
  capacity: 2,
  amenities: "",
  status: "available",
};

export default function AdminRooms() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<string | null>(null);
  const [deletingRoom, setDeletingRoom] = useState<{ id: string; name: string } | null>(null);
  const [form, setForm] = useState<RoomFormData>(defaultForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: dbRooms = [], isLoading } = useQuery({
    queryKey: ["admin-rooms"],
    queryFn: async () => {
      const { data, error } = await supabase.from("rooms").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("room-images").upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from("room-images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      let imageUrl = imagePreview;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const payload = {
        name: form.name,
        category: form.category,
        description: form.description || null,
        price: form.price,
        size: form.size || null,
        capacity: form.capacity,
        amenities: form.amenities.split(",").map((a) => a.trim()).filter(Boolean),
        image_url: imageUrl,
        status: form.status,
      };

      if (editingRoom) {
        const { error } = await supabase.from("rooms").update(payload).eq("id", editingRoom);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("rooms").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-rooms"] });
      toast.success(editingRoom ? "Room updated" : "Room created");
      closeDialog();
    },
    onError: () => toast.error("Failed to save room"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("rooms").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-rooms"] });
      toast.success("Room deleted");
      setDeleteDialogOpen(false);
      setDeletingRoom(null);
    },
    onError: () => toast.error("Failed to delete room"),
  });

  const importToDbMutation = useMutation({
    mutationFn: async (staticRoom: typeof staticRooms[0]) => {
      const payload = {
        name: staticRoom.name,
        category: staticRoom.category,
        description: staticRoom.description || null,
        price: staticRoom.price,
        size: staticRoom.size || null,
        capacity: staticRoom.capacity,
        amenities: staticRoom.amenities,
        image_url: staticRoom.image || null,
        status: "available",
      };
      const { data, error } = await supabase.from("rooms").insert(payload).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-rooms"] });
      return data;
    },
    onError: () => toast.error("Failed to import room"),
  });

  const handleEditStatic = async (staticRoom: typeof staticRooms[0]) => {
    try {
      const data = await importToDbMutation.mutateAsync(staticRoom);
      openEdit(data);
      toast.success("Room imported to database for editing");
    } catch {}
  };

  const handleDeleteStatic = async (staticRoom: typeof staticRooms[0]) => {
    // Import then delete
    try {
      const data = await importToDbMutation.mutateAsync(staticRoom);
      setDeletingRoom({ id: data.id, name: data.name });
      setDeleteDialogOpen(true);
    } catch {}
  };

  const openCreate = () => {
    setEditingRoom(null);
    setForm(defaultForm);
    setImageFile(null);
    setImagePreview(null);
    setDialogOpen(true);
  };

  const openEdit = (room: typeof dbRooms[0]) => {
    setEditingRoom(room.id);
    setForm({
      name: room.name,
      category: room.category,
      description: room.description || "",
      price: Number(room.price),
      size: room.size || "",
      capacity: room.capacity,
      amenities: (room.amenities || []).join(", "),
      status: room.status,
    });
    setImageFile(null);
    setImagePreview(room.image_url || null);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingRoom(null);
    setForm(defaultForm);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const allRooms = [
    ...dbRooms.map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      description: r.description || "",
      image: r.image_url,
      price: Number(r.price),
      size: r.size || "",
      capacity: r.capacity,
      amenities: r.amenities || [],
      status: r.status,
      isDb: true as const,
      raw: r,
    })),
    ...staticRooms.map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      description: r.description,
      image: r.image,
      price: r.price,
      size: r.size,
      capacity: r.capacity,
      amenities: r.amenities,
      status: "available",
      isDb: false as const,
      raw: null as any,
    })),
  ];

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Rooms</h1>
            <p className="text-muted-foreground text-sm">Manage room categories and inventory ({allRooms.length} rooms)</p>
          </div>
          <Button variant="gold" onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Add Room</Button>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-xl" />)}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allRooms.map((room, i) => (
            <motion.div key={room.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="admin-section p-0 overflow-hidden hover-lift">
              <div className="relative h-40 overflow-hidden bg-secondary">
                {room.image ? (
                  <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><ImageIcon className="h-12 w-12 text-muted-foreground/30" /></div>
                )}
                <div className="absolute top-3 right-3 flex gap-1.5">
                  {room.isDb ? (
                    <>
                      <Button variant="secondary" size="icon" className="h-7 w-7" onClick={() => openEdit(room.raw)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="secondary" size="icon" className="h-7 w-7" onClick={() => { setDeletingRoom({ id: room.id, name: room.name }); setDeleteDialogOpen(true); }}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="secondary" size="icon" className="h-7 w-7" onClick={() => handleEditStatic(staticRooms.find(s => s.id === room.id)!)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="secondary" size="icon" className="h-7 w-7" onClick={() => handleDeleteStatic(staticRooms.find(s => s.id === room.id)!)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-heading text-base font-semibold text-foreground">{room.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{room.category}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  {room.size && <span>{room.size}</span>}
                  <span>{room.capacity} Guests</span>
                  <span className="text-primary font-semibold">${room.price}/night</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {room.amenities.slice(0, 3).map((a) => (
                    <span key={a} className="text-xs bg-secondary px-2 py-0.5 rounded text-muted-foreground">{a}</span>
                  ))}
                  {room.amenities.length > 3 && <span className="text-xs text-muted-foreground">+{room.amenities.length - 3}</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRoom ? "Edit Room" : "Add New Room"}</DialogTitle>
            <DialogDescription>{editingRoom ? "Update room details and image." : "Fill in the details for the new room."}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {/* Image Upload */}
            <div>
              <Label>Room Image</Label>
              <div
                className="mt-1 border-2 border-dashed border-border rounded-xl p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                ) : (
                  <div className="flex flex-col items-center gap-2 py-4">
                    <Upload className="h-8 w-8 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">Click to upload an image</p>
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Room Name</Label>
                <Input className="mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ocean View Suite" />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Deluxe">Deluxe</SelectItem>
                    <SelectItem value="Suite">Suite</SelectItem>
                    <SelectItem value="Penthouse">Penthouse</SelectItem>
                    <SelectItem value="Standard">Standard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea className="mt-1" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the room..." rows={3} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Price/Night ($)</Label>
                <Input className="mt-1" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Size</Label>
                <Input className="mt-1" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} placeholder="65 m²" />
              </div>
              <div>
                <Label>Capacity</Label>
                <Input className="mt-1" type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} />
              </div>
            </div>

            <div>
              <Label>Amenities (comma separated)</Label>
              <Input className="mt-1" value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} placeholder="Wi-Fi, Smart TV, Minibar" />
            </div>

            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !form.name}>
              {saveMutation.isPending ? "Saving..." : editingRoom ? "Update Room" : "Create Room"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={(open) => { if (!open) { setDeleteDialogOpen(false); setDeletingRoom(null); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Room</DialogTitle>
            <DialogDescription>Are you sure you want to delete "{deletingRoom?.name}"? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDeleteDialogOpen(false); setDeletingRoom(null); }}>Cancel</Button>
            <Button variant="destructive" onClick={() => deletingRoom && deleteMutation.mutate(deletingRoom.id)} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
