import React from 'react';

const Doc = ({ name, description, onEdit, onDelete }) => {
    return (
        <div className='card'>
            <div className='CardContent'>
                <div><strong>{name}</strong></div>
                <div>
                    <i className="fa-solid fa-pen-to-square" onClick={onEdit}></i>
                    <i className="fa-solid fa-trash" onClick={onDelete} style={{ cursor: 'pointer', marginLeft: '10px' }}></i>
                </div>
            </div>
            <div style={{ paddingLeft: '25px' }} dangerouslySetInnerHTML={{ __html: description }} />
        </div>
    );
}

export default Doc;
