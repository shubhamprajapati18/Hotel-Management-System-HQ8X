import { AdminLayout } from "@/components/AdminLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { rooms } from "@/data/rooms";

export default function AdminRooms() {
  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Rooms</h1>
            <p className="text-muted-foreground text-sm">Manage room categories and inventory</p>
          </div>
          <Button variant="gold"><Plus className="h-4 w-4 mr-2" />Add Room</Button>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room, i) => (
          <motion.div key={room.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="admin-section p-0 overflow-hidden hover-lift">
            <div className="relative h-40 overflow-hidden">
              <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 flex gap-1.5">
                <Button variant="secondary" size="icon" className="h-7 w-7"><Edit className="h-3 w-3" /></Button>
                <Button variant="secondary" size="icon" className="h-7 w-7"><Trash2 className="h-3 w-3" /></Button>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-heading text-base font-semibold text-foreground">{room.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{room.category}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <span>{room.size}</span>
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
    </AdminLayout>
  );
}
