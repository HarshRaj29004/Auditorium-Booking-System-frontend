import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';

const Popup = ({ data, onClose }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  function b64toBlob(base64, mimeType) {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mimeType });
  }
  const openPdfInNewTab = () => {
    const newTab = window.open(data.file, '_blank');
    if (newTab) {
      newTab.focus();
    } else {
      console.error('Failed to open new tab');
    }
  };
  //here 
  const columns = React.useMemo(
    () => [
      { id: 'field', header: 'Field', accessorKey: 'field' },
      { id: 'value', header: 'Value', accessorKey: 'value' },
    ],
    []
  );

  const tableData = React.useMemo(
    () => [
      { field: 'Name', value: data.username },
      { field: 'Email', value: data.email },
      { field: 'Mobile Number', value: data.mobileno },
      { field: 'Event Description', value: data.eventdescription },
      { field: 'Date', value: formatDate(data.date) },
      { field: 'Club Name', value: data.clubname },
      { field: 'Approved By', value: data.approvedBy },
      { field: 'Start Time', value: data.startTime },
      { field: 'End Time', value: data.endTime },
      { field: 'Current Status', value: data.status },
    ],
    [data]
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white w-full md:max-w-lg lg:max-w-xl mx-4 md:mx-0 rounded p-2 overflow-auto">
        <div className="flex justify-end ">
          <button
            className="text-red-500 text-3xl pb-2 hover:text-red-600 "
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <table className="table-auto w-full border-collapse mb-4">
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell, index) => (
                  <td
                    key={cell.id}
                    className={`p-2 border ${index === 0
                      ? 'text-left whitespace-nowrap w-1/3 font-semibold overflow-ellipsis h-10'
                      : 'text-left w-full'
                      }`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={openPdfInNewTab}>
          View PDF
        </button>
      </div>
    </div>
  );
};

export default Popup;