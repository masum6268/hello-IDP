import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const userId = localStorage.getItem('userId'); 
        if (!userId) {
          throw new Error('User ID not found');
        }
        const response = await axios.get(`/api/prescriptions/patient/${userId}`); 
        setPrescriptions(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch prescriptions');
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  const handleDownload = async (prescriptionId) => {
    try {
      const response = await axios.get(`/api/prescriptions/${prescriptionId}`, {
        responseType: 'blob', 
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `prescription-${prescriptionId}.pdf`); 
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error downloading prescription:', err);
      alert('Failed to download prescription.');
    }
  };

  if (loading) {
    return <div>Loading prescriptions...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (prescriptions.length === 0) {
    return <div>No prescriptions found.</div>;
  }

  return (
    <div>
      <h2>Your Prescriptions</h2>
      <ul>
        {prescriptions.map((prescription) => (
          <li key={prescription._id}>
            <div>
              <strong>Date:</strong> {new Date(prescription.date).toLocaleDateString()}
            </div>
            <div>
              <strong>Medicines:</strong> {prescription.medicines.join(', ')}
            </div>
            <div>
              <strong>Instructions:</strong> {prescription.instructions}
            </div>
            <button onClick={() => handleDownload(prescription._id)}>
              Download
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientPrescriptions;