import React from 'react';

const Table = ({ onRowClick }) => {
    const data = [
        { name: 'สถานีบริการน้ำมัน PT - 1', status: 'Open' },
        { name: 'สถานีบริการน้ำมัน PT - 2', status: 'Closed' },
        { name: 'สถานีบริการน้ำมัน PT - 3', status: 'Open' },
    ];

    return (
        <table className="table-auto w-full mt-4">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {data.map((row, index) => (
                    <tr 
                        key={index} 
                        onClick={() => onRowClick(row.name)} 
                        className="cursor-pointer hover:bg-gray-100"
                    >
                        <td>{row.name}</td>
                        <td>{row.status}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Table;
