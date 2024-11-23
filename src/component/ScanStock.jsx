import React, { useState, useEffect } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { detailData, stockChange } from "../redux/async/dataSlice";
import { addLogs } from "../redux/async/logSlice";
import { v4 as uuidv4 } from "uuid";

const ScanStock = () => {
  const [data, setData] = useState("Not Found");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((state) => state.products);

  const [inputLog, setInputLog] = useState({
    product_id: "",
    type: "stock_in",
    quantity: 0,
    note: "",
  });

  useEffect(() => {
    if (data !== "Not Found") {
      dispatch(detailData(data));
    }
  }, [data, dispatch]);

  const handleReset = () => {
    setData("");
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
        quantity: parseInt(inputLog.quantity, 10),
        note: inputLog.note,
        date: new Date().toISOString(),
      };

      let updatedStock = product.stock;
      if (inputLog.type === "stock_in") {
        updatedStock += parseInt(inputLog.quantity, 10); // Menambahkan stock
      } else if (inputLog.type === "stock_out") {
        updatedStock -= parseInt(inputLog.quantity, 10); // Mengurangi stock
      }

      // Dispatch log and update product stock
      dispatch(addLogs(newLog));
      dispatch(stockChange({ id: product.id, stock: updatedStock })); // Update stock in the state

      dispatch(addLogs(newLog));
      setInputLog({
        product_id: "",
        type: "stock_in",
        quantity: 0,
        note: "",
      });
      navigate(-1);
    }
  };

  return (
    <div>
      <button onClick={handleReset}>Back</button>
      <h1>Scan Stock</h1>
      <div className="scan-container">
      <BarcodeScannerComponent
        width={500}
        height={500}
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
          <h2>Product Details:</h2>
          <p>ID: {product.id}</p>
          <p>Name: {product.name}</p>
          <p>Description: {product.description}</p>
          <p>Price: {product.price}</p>
          <p>Stock: {product.stock}</p>

          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="stockType">Type:</label>
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
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                name="quantity"
                id="quantity"
                value={inputLog.quantity}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="note">Note:</label>
              <textarea
                name="note"
                id="note"
                value={inputLog.note}
                onChange={handleChange}
              />
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ScanStock;
