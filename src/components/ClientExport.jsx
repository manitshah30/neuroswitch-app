import React, { useState } from 'react';

const ClientExport = () => {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        setLoading(true);
        try {
            // 1. Request the file from your new API route
            const response = await fetch('/api/export');

            if (!response.ok) {
                throw new Error('Export failed');
            }

            // 2. Convert the response to a Blob (file object)
            const blob = await response.blob();
            
            // 3. Create a temporary link to force the download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "Client_Data_Export.zip";
            document.body.appendChild(a);
            a.click();
            
            // 4. Cleanup
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

        } catch (error) {
            console.error(error);
            alert("Failed to download data. Please try again.");
        }
        setLoading(false);
    };

    return (
        <button 
            onClick={handleDownload} 
            disabled={loading}
            style={{
                padding: '12px 24px',
                backgroundColor: '#0070f3',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: loading ? 'wait' : 'pointer',
                fontWeight: 'bold',
                marginTop: '20px' 
            }}
        >
            {loading ? 'Preparing Zip File...' : 'Download User Data'}
        </button>
    );
};

export default ClientExport;