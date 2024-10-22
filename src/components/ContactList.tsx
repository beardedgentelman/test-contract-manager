import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import {Link, useNavigate} from 'react-router-dom';

interface Contact {
    id: string;
    name: string;
    fullName: string;
    email: string;
    phone: string;
}

const ContactList = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const navigate = useNavigate();

    const handleEdit = (id: string) => navigate(`/edit/${id}`);

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this contact?");
        if (confirmDelete) {
            await deleteDoc(doc(db, 'contacts', id));
            setContacts(contacts.filter(contact => contact.id !== id));
        }
    };

    useEffect(() => {
        const fetchContacts = async () => {
            const querySnapshot = await getDocs(collection(db, 'contacts'));
            const contactsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Contact[];

            setContacts(contactsData);
        };

        fetchContacts();
    }, []);

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold my-4">Contact List</h1>
            <Link to="/add" className="mb-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">Add Contact</Link>
            <table className="min-w-full bg-white border border-gray-300 rounded shadow-md">
                <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Name</th>
                    <th className="py-3 px-6 text-left">Full Name</th>
                    <th className="py-3 px-6 text-left">Email</th>
                    <th className="py-3 px-6 text-left">Phone</th>
                    <th className="py-3 px-6 text-left">Actions</th>
                </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                {contacts.map(contact => (
                    <tr key={contact.id} className="border-b border-gray-200 hover:bg-gray-100">
                        <td className="py-3 px-6">{contact.name}</td>
                        <td className="py-3 px-6">{contact.fullName}</td>
                        <td className="py-3 px-6">{contact.email}</td>
                        <td className="py-3 px-6">{contact.phone}</td>
                        <td className="py-3 px-6">
                            <button onClick={() => handleEdit(contact.id)}
                                    className="text-blue-500 hover:text-blue-700 mr-2">Edit
                            </button>
                            <button onClick={() => handleDelete(contact.id)}
                                    className="text-red-500 hover:text-red-700">Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ContactList;
