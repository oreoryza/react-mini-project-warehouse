import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchData, deleteData, toggleUpdate } from "../redux/async/dataSlice";
import { fetchLogs } from "../redux/async/logSlice";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { products, loading, error, isSuccess } = useSelector(
    (state) => state.products
  );
  const { logs } = useSelector((state) => state.logs);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchData());
    dispatch(fetchLogs());
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(fetchData());
    }
  }, [isSuccess]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container">
      <div className="header">
        <Link to="/stock-out">
          <button>Scan</button>
        </Link>
        <Link to="/stock-in">
          <button>Input</button>
        </Link>
      </div>
      <table>
        <thead>
          <tr>
            <th>Nama Produk</th>
            <th>Deskripsi</th>
            <th>Harga</th>
            <th>Stok</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.price}</td>
              <td>{product.stock}</td>
              <td>
                <div className="action-btn">
                  <button onClick={() => dispatch(deleteData(product.id))}>
                    Hapus
                  </button>
                  <Link to="/stock-in" state={{ product }}>
                    <button onClick={() => dispatch(toggleUpdate())}>
                      Edit
                    </button>
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Daftar Logs:</h2>
      <div className="log-container">
        <ul>
          {logs.map((log) => (
            <li key={log.id}>
              <h1>
                ==========================================================
              </h1>
              <p>Product ID: {log.product_id}</p>
              <p>Type: {log.type}</p>
              <p>Quantity: {log.quantity}</p>
              <p>Note: {log.note}</p>
              <p>Date: {new Date(log.date).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
