import React, { useState, useEffect } from 'react';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { GiKnightBanner } from 'react-icons/gi';
import { useSelector, useDispatch } from 'react-redux';
import Pagination from '../Pagination';
import Search from '../components/Search';
import { get_products, product_delete } from '../../store/Reducers/productReducer';

const Products = () => {
    const dispatch = useDispatch();
    const { products, totalProduct, loader, errorMessage } = useSelector(state => state.product);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [parPage, setParPage] = useState(5);

    useEffect(() => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue,
        };
        dispatch(get_products(obj));
    }, [searchValue, currentPage, parPage, dispatch]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            dispatch(product_delete(id)).then(() => {
                // Fetch products again after deletion to update the list
                const obj = {
                    parPage: parseInt(parPage),
                    page: parseInt(currentPage),
                    searchValue,
                };
                dispatch(get_products(obj));
            });
        }
    };

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='w-full p-4 bg-[#283046] rounded-md'>
                <Search setParPage={setParPage} setSearchValue={setSearchValue} searchValue={searchValue} />
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                <div className='relative overflow-x-auto mt-5'>
                    <table className='w-full text-sm text-left text-[#d0d2d6]'>
                        <thead className='text-sm text-[#d0d2d6] uppercase border-b border-slate-700'>
                            <tr>
                                <th scope='col' className='py-3 px-4'>No</th>
                                <th scope='col' className='py-3 px-4'>Image</th>
                                <th scope='col' className='py-3 px-4'>Name</th>
                                <th scope='col' className='py-3 px-4'>Category</th>
                                <th scope='col' className='py-3 px-4'>Brand</th>
                                <th scope='col' className='py-3 px-4'>Price</th>
                                <th scope='col' className='py-3 px-4'>Discount</th>
                                <th scope='col' className='py-3 px-4'>Stock</th>
                                <th scope='col' className='py-3 px-4'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="text-center py-4">No products found</td>
                                </tr>
                            ) : (
                                products.map((d, i) => (
                                    <tr key={d._id}>
                                        <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>{(currentPage - 1) * parPage + i + 1}</td>
                                        <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                            <img className='w-[45px] h-[45px]' src={d.images[0]} alt="" />
                                        </td>
                                        <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                            <span>{d?.name?.slice(0, 16)}...</span>
                                        </td>
                                        <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                            <span>{d.category}</span>
                                        </td>
                                        <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                            <span>{d.brand}</span>
                                        </td>
                                        <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                            <span>${d.price}</span>
                                        </td>
                                        <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                            {d.discount === 0 ? <span>no discount</span> : <span>${d.discount}%</span>}
                                        </td>
                                        <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                            <span>{d.stock}</span>
                                        </td>
                                        <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                            <div className='flex justify-start items-center gap-4'>
                                                <Link to={`/seller/dashboard/edit-product/${d._id}`} className='p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50'><FaEdit /></Link>
                                                <Link className='p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50'><FaEye /></Link>
                                                <button
                                                    onClick={() => handleDelete(d._id)}
                                                    className='p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50'>
                                                    <FaTrash />
                                                </button>
                                                <Link to={`/seller/dashboard/add-banner/${d._id}`} className='p-[6px] bg-cyan-500 rounded hover:shadow-lg hover:shadow-cyan-500/50'><GiKnightBanner /></Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {totalProduct > parPage && (
                    <div className='w-full flex justify-end mt-4'>
                        <Pagination
                            pageNumber={currentPage}
                            setPageNumber={setCurrentPage}
                            totalItem={totalProduct}
                            parPage={parPage}
                            showItem={4}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;