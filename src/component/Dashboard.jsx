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

  const { lang } = useSelector((state) => state.lang);

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
    <div>
      <div className="header">
        <div className="scan-button">
          <h1>{lang === "en" ? "Scan Barcode" : "Pindai Kode Bar"}</h1>
          <Link to="/stock-out">
            <button className="">
              <i className="bi bi-upc-scan i-cstm"></i>
              {lang === "en" ? (
                <p>
                  Scan <span>Barcode</span>
                </p>
              ) : (
                <p>
                  Pindai <span>Kode Bar</span>
                </p>
              )}
            </button>
          </Link>
        </div>
        <div className="input-button">
          <h1>{lang === "en" ? "Input Product" : "Masukkan Produk"}</h1>
          <Link to="/stock-in">
            <button>
              <i className="bi bi-file-arrow-down-fill i-cstm"></i>
              {lang === "en" ? (
                <p>
                  Input <span>Product</span>
                </p>
              ) : (
                <p>
                  Input <span>Produk</span>
                </p>
              )}
            </button>
          </Link>
        </div>
        <div className="arrow">
          <a href="#product-list">
            <i class="bi bi-chevron-down"></i>
          </a>
        </div>
      </div>
        <h2 id="product-list">{lang === "en" ? "Product List:" : "Daftar Produk:"}</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>{lang === "en" ? "Product Name" : "Nama Produk"}</th>
              <th>{lang === "en" ? "Description" : "Deskripsi"}</th>
              <th className="hidden">{lang === "en" ? "Price" : "Harga"}</th>
              <th className="hidden">{lang === "en" ? "Stock" : "Stok"}</th>
              <th>{lang === "en" ? "Action" : "Aksi"}</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td className="hidden">{product.price}</td>
                <td className="hidden">{product.stock}</td>
                <td>
                  <div className="action-btn">
                    <button title="Delete" onClick={() => dispatch(deleteData(product.id))}>
                      <i class="bi bi-trash-fill"></i>
                    </button>
                    <Link to="/stock-in" state={{ product }}>
                      <button title="Edit" onClick={() => dispatch(toggleUpdate())}>
                        <i class="bi bi-pencil-fill"></i>
                      </button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>{lang === "en" ? "Log History:" : "Riwayat Catatan:"}</h2>
      <div className="log-container">
        <ul>
          {logs.map((log) => (
            <li key={log.id}>
              <h1>==============</h1>
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
