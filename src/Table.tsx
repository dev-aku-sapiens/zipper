import React, { useState } from 'react';

interface TableProps {
  data: {
    url: string;
    selected: boolean;
  }[];
  onSelect: (index: number) => void;
  onSelectAll: (selected: boolean) => void;
}

const Table: React.FC<TableProps> = ({ data, onSelect, onSelectAll }) => {
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const handleSelectAllChange = () => {
    setSelectAllChecked(!selectAllChecked);
    onSelectAll(!selectAllChecked);
  };

  return (
    <div className='w-full max-h-[73vh] h-[73vh] overflow-y-auto border border-red-500'>
      <table className='min-w-full'>
        <thead className='bg-gray-100 sticky top-0'>
          <tr>
            <th className='px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider'>
              <input
                type='checkbox'
                checked={selectAllChecked}
                onChange={handleSelectAllChange}
                className='form-checkbox size-4 text-red-600 rounded cursor-pointer focus:ring-red-600 ring-offset-red-100'
              />
            </th>
            <th className='px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider'>
              Image
            </th>
            <th className='px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase tracking-wider'>
              File Name
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className='bg-white'>
              <td className='px-5 py-5 border-b'>
                <input
                  type='checkbox'
                  checked={item.selected}
                  onChange={() => onSelect(index)}
                  className='form-checkbox size-4 text-red-600 rounded cursor-pointer focus:ring-red-600 ring-offset-red-100'
                />
              </td>
              <td className='px-5 py-5 border-b'>
                <img
                  src={`${item.url}?w=128&h=128&dpr=1`}
                  alt={`file-${index}`}
                  className='w-10 h-10 object-cover rounded-md'
                />
              </td>
              <td className='px-5 py-5 border-b text-sm'>
                {item.url.split('/').pop()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
