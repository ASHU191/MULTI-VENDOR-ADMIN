import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { PropagateLoader } from 'react-spinners';
import { GrClose } from 'react-icons/gr';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import { BsImage } from 'react-icons/bs';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import Search from '../components/Search';
import {
    categoryAdd,
    messageClear,
    get_category,
    delete_category
} from '../../store/Reducers/categoryReducer';

const Category = () => {
    const dispatch = useDispatch();
    const { loader, successMessage, errorMessage, categorys, totalCategories } = useSelector(state => state.category);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [parPage, setParPage] = useState(5);
    const [show, setShow] = useState(false);
    const [imageShow, setImage] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [imageFile, setImageFile] = useState(null);

    const imageHandle = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            setImage(URL.createObjectURL(files[0]));
            setImageFile(files[0]);
        }
    };

    const addCategory = (e) => {
        e.preventDefault();
        dispatch(categoryAdd({ name: categoryName, image: imageFile }));
    };

    const handleDelete = (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            dispatch(delete_category(categoryId))
                .unwrap()  // For proper promise handling and catching errors
                .then(() => {
                    fetchCategories(); // Refresh categories after deletion
                })
                .catch(() => {
                    toast.error('Failed to delete category');
                });
        }
    };
    

    const fetchCategories = () => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue
        };
        dispatch(get_category(obj));
    };

    useEffect(() => {
        fetchCategories();
    }, [searchValue, currentPage, parPage]);

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            setCategoryName('');
            setImageFile(null);
            setImage('');
        }
    }, [successMessage, errorMessage]);

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='flex lg:hidden justify-between items-center mb-5 p-4 bg-[#283046] rounded-md'>
                <h1 className='text-[#d0d2d6] font-semibold text-lg'>Categories</h1>
                <button onClick={() => setShow(true)} className='bg-indigo-500 shadow-lg hover:shadow-indigo-500/50 px-4 py-2 cursor-pointer text-white rounded-sm text-sm'>Add</button>
            </div>
            <div className='flex flex-wrap w-full'>
                <div className='w-full lg:w-7/12'>
                    <div className='w-full p-4 bg-[#283046] rounded-md'>
                        <Search setParPage={setParPage} setSearchValue={setSearchValue} searchValue={searchValue} />
                        <div className='relative overflow-x-auto'>
                            <table className='w-full text-sm text-left text-[#d0d2d6]'>
                                <thead className='text-sm text-[#d0d2d6] uppercase border-b border-slate-700'>
                                    <tr>
                                        <th scope='col' className='py-3 px-4'>No</th>
                                        <th scope='col' className='py-3 px-4'>Image</th>
                                        <th scope='col' className='py-3 px-4'>Name</th>
                                        <th scope='col' className='py-3 px-4'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categorys.map((d, i) => (
                                        <tr key={d.id}>
                                            <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>{i + 1}</td>
                                            <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                            <img className='w-[45px] h-[45px] object-contain rounded-md' src={d.image} alt={d.name} />
                                            </td>

                                            <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                                <span>{d.name}</span>
                                            </td>
                                            <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                                <div className='flex justify-start items-center gap-4'>
                                                    <Link to={`/edit-category/${d.id}`} className='p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50'>
                                                        <FaEdit />
                                                    </Link>
                                                    <button 
                                                        className='p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50'
                                                        onClick={() => handleDelete(d._id)}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className='w-full flex justify-end mt-4'>
                            <Pagination
                                pageNumber={currentPage}
                                setPageNumber={setCurrentPage}
                                totalItem={totalCategories} // Use dynamic totalCategories here
                                parPage={parPage}
                                showItem={4}
                            />
                        </div>
                    </div>
                </div>
                <div className={`w-[320px] lg:w-5/12 translate-x-100 lg:relative lg:right-0 fixed ${show ? 'right-0' : '-right-[340px]'} z-[9999] top-0 transition-all duration-500`}>
                    <div className='w-full pl-5'>
                        <div className='bg-[#283046] h-screen lg:h-auto px-3 py-4 rounded-md'>
                            <div className='flex items-center justify-between'>
                                <h1 className='text-lg font-medium text-[#d0d2d6]'>Add Category</h1>
                            </div>
                            <form onSubmit={addCategory}>
                                <div className='flex flex-col gap-4'>
                                    <div className='flex items-center justify-center'>
                                        <label className='flex flex-col justify-center items-center cursor-pointer w-full h-[250px] border border-dashed border-[#8e9ca5] rounded-lg'>
                                            {imageShow ? 
                                                <img src={imageShow} alt="Category" className='w-full h-full object-cover rounded-md' /> : 
                                                <>
                                                    <BsImage className='text-7xl text-[#8e9ca5]' />
                                                    <span className='text-[#8e9ca5]'>Choose an image</span>
                                                </>
                                            }
                                            <input type="file" className='hidden' onChange={imageHandle} accept='image/*' />
                                        </label>
                                    </div>
                                    <input 
                                        type="text" 
                                        required 
                                        className='border border-slate-700 px-2 py-2 bg-transparent outline-none rounded-md' 
                                        placeholder='Category Name'
                                        value={categoryName}
                                        onChange={(e) => setCategoryName(e.target.value)}
                                    />
                                    <button className='bg-indigo-500 shadow-lg hover:shadow-indigo-500/50 py-2 rounded-md text-white'>
                                        {loader ? <PropagateLoader color="#ffffff" size={8} /> : 'Add Category'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Category;