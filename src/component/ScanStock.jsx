import React, { useState, useEffect } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  detailData,
  stockChange,
  resetProduct,
} from "../redux/async/dataSlice";
import { addLogs } from "../redux/async/logSlice";
import { v4 as uuidv4 } from "uuid";
import { Report } from "notiflix/build/notiflix-report-aio";

const ScanStock = () => {
  const [data, setData] = useState("Not Found");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { product } = useSelector((state) => state.products);

  const { lang } = useSelector((state) => state.lang);

  const [scannerSize, setScannerSize] = useState({ width: 500, height: 500 });

  const [inputLog, setInputLog] = useState({
    product_id: "",
    type: "stock_in",
    quantity: 0,
    note: "",
  });

  useEffect(() => {
    if (data !== "Not Found") {
      dispatch(detailData(data));
      Report.success("Scan Success", `Product ID: ${data}`);
    }
  }, [data, dispatch]);

  const handleReset = () => {
    dispatch(resetProduct());
    navigate(-1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputLog((prevInputLog) => ({
      ...prevInputLog,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (product.id && inputLog.quantity > 0) {
      const newLog = {
        id: uuidv4(),
        product_id: product.id,
        type: inputLog.type,
        quantity: parseInt(inputLog.quantity),
        note: inputLog.note,
        date: new Date().toISOString(),
      };

      let updatedStock = product.stock;
      if (inputLog.type === "stock_in") {
        updatedStock += parseInt(inputLog.quantity); // add stock
      } else if (inputLog.type === "stock_out") {
        updatedStock -= parseInt(inputLog.quantity); // min stock
      }

      // Dispatch log and update product stock
      dispatch(addLogs(newLog));
      dispatch(stockChange({ id: product.id, stock: updatedStock })); // Update stock in the state

      setInputLog({
        product_id: "",
        type: "stock_in",
        quantity: 0,
        note: "",
      });
      navigate(-1);
    }
  };

  const handleResize = () => {
    if (window.innerWidth < 425) {
      setScannerSize({ width: 250, height: 250 });
    } else if (window.innerWidth < 768) {
      setScannerSize({ width: 300, height: 300 });
    } else {
      setScannerSize({ width: 500, height: 500 });
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <button className="btn-back" onClick={handleReset}>
        <i class="bi bi-chevron-left"></i> {lang === "en" ? "Back" : "Kembali"}
      </button>
      <div className="scan-container">
        <BarcodeScannerComponent
          width={scannerSize.width}
          height={scannerSize.height}
          onUpdate={(err, result) => {
            if (result) {
              setData(result.text);
            } else {
              setData("Not Found");
            }
          }}
        />
      </div>

      {product.id && (
        <div>
          <h2>{lang === "en" ? "Product Detail" : "Detil Produk"}:</h2>
          <p>ID: {product.id}</p>
          <p>
            {lang === "en" ? "Name" : "Nama"}: {product.name}
          </p>
          <p>
            {lang === "en" ? "Description" : "Deskripsi"}: {product.description}
          </p>
          <p>
            {lang === "en" ? "Price" : "Harga"}: {product.price}
          </p>
          <p>
            {lang === "en" ? "Stock" : "Stok"}: {product.stock}
          </p>

          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="stockType">
                {lang === "en" ? "Type" : "Tipe"}:
              </label>
              <select
                name="stockType"
                id="stockType"
                value={inputLog.type}
                onChange={handleChange}
              >
                <option value="stock_in">Stock In</option>
                <option value="stock_out">Stock Out</option>
              </select>
            </div>
            <div>
              <label htmlFor="quantity">
                {lang === "en" ? "Quantity" : "Total"}:
              </label>
              <input
                type="number"
                name="quantity"
                id="quantity"
                min={1}
                value={inputLog.quantity}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="note">
                {lang === "en" ? "Note" : "Catatan"}:
              </label>
              <textarea
                name="note"
                id="note"
                value={inputLog.note}
                onChange={handleChange}
              />
            </div>
            <div className="btn-submit">
              <button type="submit">
                {lang === "en" ? "Submit" : "Kirim"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ScanStock;
