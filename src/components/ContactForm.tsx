import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { addDoc, doc, updateDoc, getDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

interface FormValues {
    name: string;
    fullName: string;
    email: string;
    phone: string;
}

const schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    fullName: Yup.string().required('Name is required'),
    email: Yup.string()
        .email('Email is invalid')
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email must be a valid format (example@example.com)')
        .required('Email is required'),
    phone: Yup.string()
        .matches(/^[0-9]+$/, 'Phone must be numeric')
        .required('Phone is required'),
});

const ContactForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormValues>({
        resolver: yupResolver(schema)
    });
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            if (id) {
                const docRef = doc(db, 'contacts', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const contact = docSnap.data() as FormValues;
                    reset(contact);
                }
            }
        })();
    }, [id, reset]);

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        if (id) {
            const docRef = doc(db, 'contacts', id);
            await updateDoc(docRef, {
                name: data.name,
                fullName: data.fullName,
                email: data.email,
                phone: data.phone
            });
        } else {
            await addDoc(collection(db, 'contacts'), data);
        }
        navigate('/');
    };

    const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9+]/g, '');
        setValue('phone', value);
    };

    const handleCancel: React.MouseEventHandler<HTMLButtonElement> = () => navigate('/');

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold my-4">{id ? 'Edit Contact' : 'Add Contact'}</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Name"
                        {...register('name')}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Full Name"
                        {...register('fullName')}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.fullName && <p className="text-red-500 text-xs italic">{errors.fullName.message}</p>}
                </div>

                <div className="mb-4">
                    <input
                        type="email"
                        placeholder="Email"
                        {...register('email')}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.email && <p className="text-red-500 text-xs italic">{errors.email.message}</p>}
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Phone"
                        {...register('phone')}
                        onInput={handlePhoneInputChange}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs italic">{errors.phone.message}</p>}
                </div>

                <div className="flex items-center justify-between">
                    <button type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        {id ? 'Save' : 'Add Contact'}
                    </button>
                    <button type="button" onClick={handleCancel}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContactForm;
