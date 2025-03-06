import React, { useState, useEffect } from "react";
import "./ShiftManagement.css";

interface Shift {
  id: number;
  startTime: string;
  endTime: string;
  employee: string;
}

const ShiftManagement = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [newShift, setNewShift] = useState<Shift>({
    id: 0,
    startTime: "",
    endTime: "",
    employee: "",
  });
  const [editingShiftId, setEditingShiftId] = useState<number | null>(null);

  useEffect(() => {
    fetchShifts();
  }, []);

  // ✅ 1. Vardiyaları Listeleme
  const fetchShifts = () => {
    fetch("http://localhost:9090/v1/dev/company-manager/shifts/list", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setShifts(data))
      .catch((err) => console.error("Vardiyaları çekerken hata oluştu:", err));
  };

  // ✅ 2. Vardiya Ekleme (POST)
  const addShift = () => {
    fetch("http://localhost:9090/v1/dev/company-manager/shifts/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        startTime: newShift.startTime,
        endTime: newShift.endTime,
        employee: newShift.employee,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        fetchShifts(); // Listeyi güncelle
        setNewShift({ id: 0, startTime: "", endTime: "", employee: "" });
      })
      .catch((err) => console.error("Vardiya eklenirken hata oluştu:", err));
  };

  // ✅ 3. Vardiya Güncelleme (UPDATE)
  const updateShift = () => {
    if (editingShiftId === null) return;

    fetch(`http://localhost:9090/v1/dev/company-manager/shifts/update/${editingShiftId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        startTime: newShift.startTime,
        endTime: newShift.endTime,
        employee: newShift.employee,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        fetchShifts(); // Listeyi güncelle
        setNewShift({ id: 0, startTime: "", endTime: "", employee: "" });
        setEditingShiftId(null);
      })
      .catch((err) => console.error("Vardiya güncellenirken hata oluştu:", err));
  };

  // ✅ 4. Vardiya Silme (DELETE)
  const deleteShift = (id: number) => {
    fetch(`http://localhost:9090/v1/dev/company-manager/shifts/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(() => fetchShifts()) // Listeyi güncelle
      .catch((err) => console.error("Vardiya silinirken hata oluştu:", err));
  };

  // ✅ 5. Vardiya Düzenleme Moduna Geçme
  const editShift = (shift: Shift) => {
    setNewShift(shift);
    setEditingShiftId(shift.id);
  };

  return (
    <div className="shift-management">
      <h2>Vardiya Yönetimi</h2>

      <div className="shift-form">
        <input
          type="time"
          name="startTime"
          value={newShift.startTime}
          onChange={(e) =>
            setNewShift({ ...newShift, startTime: e.target.value })
          }
        />
        <input
          type="time"
          name="endTime"
          value={newShift.endTime}
          onChange={(e) =>
            setNewShift({ ...newShift, endTime: e.target.value })
          }
        />
        <input
          type="text"
          name="employee"
          value={newShift.employee}
          onChange={(e) =>
            setNewShift({ ...newShift, employee: e.target.value })
          }
          placeholder="Çalışan"
        />
        {editingShiftId ? (
          <button onClick={updateShift}>Vardiya Güncelle</button>
        ) : (
          <button onClick={addShift}>Vardiya Ekle</button>
        )}
      </div>

      <div className="shift-list">
        <h3>Güncel Vardiyalar</h3>
        <ul>
          {shifts.map((shift) => (
            <li key={shift.id}>
              <span>
                {shift.startTime} - {shift.endTime} | {shift.employee}
              </span>
              <button onClick={() => editShift(shift)}>Düzenle</button>
              <button onClick={() => deleteShift(shift.id)}>Sil</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ShiftManagement;
  