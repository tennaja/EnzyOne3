import React from 'react';

const Breadcrumb = ({ items, onNavigate }) => {
    return (
        <div className="mb-4 flex space-x-2 text-sm text-gray-600">
            {items.map((item, index) => (
                <span 
                    key={index} 
                    onClick={() => onNavigate(index)} 
                    className="cursor-pointer hover:underline"
                >
                    {item}
                    {index < items.length - 1 && ' / '}
                </span>
            ))}
        </div>
    );
};

export default Breadcrumb;
