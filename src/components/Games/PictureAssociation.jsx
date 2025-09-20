import React from 'react'
import { Link } from 'react-router-dom';

function PictureAssociation() {
  return (
    <div className='text-white'>PictureAssociation
        <Link
        to="/dashboard"
        className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
      >
        &larr; Back to Dashboard
      </Link>
    </div>
  )
}

export default PictureAssociation