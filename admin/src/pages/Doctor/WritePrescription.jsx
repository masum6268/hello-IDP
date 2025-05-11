jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const WritePrescription = () => {
  const { dToken } = useContext(DoctorContext);
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const [prescriptionText, setPrescriptionText] = useState('');

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/doctor/appointment/${appointmentId}`, { headers: { token: dToken } });
        if (data.success && data.appointment.prescription) {
          setPrescriptionText(data.appointment.prescription);
        }
      } catch (error) {
        console.error("Error fetching appointment details:", error);
        toast.error("Failed to fetch appointment details.");
      }
    };
    if (dToken && appointmentId) {
      fetchAppointmentDetails();
    }
  }, [dToken, appointmentId]);

  const handleSubmit = async () => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/doctor/write-prescription`, { appointmentId, prescription: prescriptionText }, { headers: { token: dToken } });
      toast.success(data.message);
      navigate('/admin/appointments');
    } catch (error) {
      console.error("Error submitting prescription:", error);
      toast.error("Failed to submit prescription.");
    }
  };

  return (
    <div className="write-prescription-container">
      <h2>Write Prescription for Appointment ID: {appointmentId}</h2>
      <textarea
        value={prescriptionText}
        onChange={(e) => setPrescriptionText(e.target.value)}
        placeholder="Enter prescription here..."
        rows="10"
        cols="50"
      ></textarea>
      <button onClick={handleSubmit}>Submit Prescription</button>
    </div>
  );
};
export default WritePrescription;