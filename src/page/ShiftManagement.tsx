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
      startTime: '',
      endTime: '',
      employee: '',
    });
    const [editingShiftId, setEditingShiftId] = useState<number | null>(null);
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setNewShift((prevShift) => ({
        ...prevShift,
        [name]: value,
      }));
    };
  
    const addShift = () => {
      if (newShift.startTime && newShift.endTime && newShift.employee) {
        if (editingShiftId === null) {
          setShifts([
            ...shifts,
            { id: shifts.length + 1, startTime: newShift.startTime, endTime: newShift.endTime, employee: newShift.employee },
          ]);
        } else {
          setShifts(
            shifts.map((shift) =>
              shift.id === editingShiftId
                ? { ...shift, startTime: newShift.startTime, endTime: newShift.endTime, employee: newShift.employee }
                : shift
            )
          );
        }
        setNewShift({ id: 0, startTime: '', endTime: '', employee: '' });
        setEditingShiftId(null); 
      }
    };
  
    const deleteShift = (id: number) => {
      setShifts(shifts.filter((shift) => shift.id !== id));
    };
  
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
            onChange={handleInputChange}
            placeholder="Start Time"
          />
          <input
            type="time"
            name="endTime"
            value={newShift.endTime}
            onChange={handleInputChange}
            placeholder="End Time"
          />
          <input
            type="text"
            name="employee"
            value={newShift.employee}
            onChange={handleInputChange}
            placeholder="Çalışan"
          />
          <button onClick={addShift}>{editingShiftId ? 'Vardiya Güncelle' : 'Vardiya Ekle'}</button>
        </div>
  
        <div className="shift-list">
          <h3>Güncel Vardiyalar</h3>
          <ul>
            {shifts.map((shift) => (
              <li key={shift.id}>
                <span>{shift.startTime} - {shift.endTime} | {shift.employee}</span>
                <button onClick={() => editShift(shift)}>Edit</button>
                <button onClick={() => deleteShift(shift.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };
  
  export default ShiftManagement;
  