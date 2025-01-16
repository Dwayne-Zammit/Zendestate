import React from 'react';
import '../../styles/pagination.css';

interface PaginationProps {
  totalPages: number;
  pageNumber: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationProps> = ({ totalPages, pageNumber, onPageChange }) => (
  totalPages > 0 && (
    <div className="paginationControls">
      <button disabled={pageNumber === 1} onClick={() => onPageChange(pageNumber - 1)}>
        Previous
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          className={pageNumber === page ? 'active' : ''}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button disabled={pageNumber === totalPages} onClick={() => onPageChange(pageNumber + 1)}>
        Next
      </button>
    </div>
  )
);

export default PaginationControls;
