import React from "react";
import { Card, Table } from "@themesberg/react-bootstrap";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { toWords } from "../../services/numberWordService";

export class Invoice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      company: props.company,
      user: props.user,
      loading: false,
      saving: false,
    };
  }

  getWords(amount) {
    return toWords(amount);
  }

  totalCost = () => {
    const { items } = this.props;
    return items.reduce((total, item) => total + item.rate * item.quantity, 0);
  };

  formatCurrency2(x) {
    if (x) {
      const parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return `${parts.join(".")}`;
    }
    return "0";
  }

  formatCurrency(x) {
    return x.toLocaleString(undefined, { minimumFractionDigits: 2 });
  }

  combineItems = (items) => {
    return items.reduce((acc, item) => {
      const existingItem = acc.find(
        (i) => i.order.product_name === item.order.product_name
      );
      if (existingItem) {
        existingItem.qty_sold += item.qty_sold;
      } else {
        acc.push({ ...item });
      }
      return acc;
    }, []);
  };

  render() {
    const { invoice, company, items, pos_items, total_balance, prev_balance } =
      this.props;
    const combinedItems = this.combineItems(pos_items);

    // Calculate amounts (use invoice fields if provided else derive)
    const itemsSubtotal = items && items.length > 0 ? this.totalCost() : 0;
    const subtotal = itemsSubtotal > 0 ? itemsSubtotal : (invoice && invoice.amount ? Number(invoice.amount) : 0);
    const vatRate = invoice && (invoice.vat_rate !== undefined && invoice.vat_rate !== null ? invoice.vat_rate : (invoice.vat_percent || 0));
    const vatAmount = (parseFloat(subtotal || 0) * parseFloat(vatRate || 0)) / 100;
    const totalWithVat = parseFloat(subtotal || 0) + parseFloat(vatAmount || 0);
    const amountReceived = invoice && (invoice.total_payment !== undefined && invoice.total_payment !== null) ? Number(invoice.total_payment) : (invoice.amount_paid || 0);
    const computedBalance = totalWithVat - amountReceived;
    const prevBal = prev_balance || 0;
    const totalBal = (total_balance !== undefined && total_balance !== null) ? Number(total_balance) : (prevBal + computedBalance);

    // Thermal-friendly compact layout (bold, larger, black text)
    return (
      <div style={{ width: "100%", fontFamily: "monaco, Consolas, monospace", color: "black", padding: 8 }}>
        <div style={{ textAlign: "center", marginBottom: 8, fontWeight: 900, color: 'black' }}>
          <div style={{ fontSize: 20, fontWeight: 900 }}>{company?.name || ""}</div>
          <div style={{ fontSize: 12, fontWeight: 800 }}>{company?.address}</div>
          <div style={{ fontSize: 12, fontWeight: 800 }}>{company?.phone_one} {company?.phone_two ? `| ${company.phone_two}` : ''}</div>
        </div>

        <div style={{ fontSize: 12, marginBottom: 8, fontWeight: 800, color: 'black' }}>
          Date: {invoice.created_at ? moment(invoice.created_at).format('YYYY-MM-DD HH:mm') : ''}
          {'  '}
          Invoice#: {invoice.invoice_no}
        </div>

        <div style={{ fontSize: 12, marginBottom: 8, fontWeight: 800, color: 'black' }}>
          Customer: {invoice.client?.name || 'Walk-in'}
          {invoice.client?.phone ? ` | ${invoice.client.phone}` : ''}
        </div>

        <div style={{ borderTop: '1px dashed #000', marginTop: 6, marginBottom: 6 }} />

        {/* Compact header for thermal print */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 900, marginBottom: 6, color: 'black' }}>
          <div style={{ width: '55%', fontWeight: 900 }}>Product</div>
          <div style={{ width: '15%', textAlign: 'right', fontWeight: 900 }}>Qty</div>
          <div style={{ width: '15%', textAlign: 'right', fontWeight: 900 }}>Price</div>
          <div style={{ width: '15%', textAlign: 'right', fontWeight: 900 }}>Amount</div>
        </div>

        <div style={{ fontSize: 12, color: 'black' }}>
          {items.map((item, i) => (
            <div key={`it-${i}`} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontWeight: 800, color: 'black' }}>
              <div style={{ width: '55%', fontWeight: 800 }}>{item.description}</div>
              <div style={{ width: '15%', textAlign: 'right', fontWeight: 800 }}>{item.quantity}</div>
              <div style={{ width: '15%', textAlign: 'right', fontWeight: 800 }}>{this.formatCurrency(item.rate)}</div>
              <div style={{ width: '15%', textAlign: 'right', fontWeight: 800 }}>{this.formatCurrency(item.amount || item.rate * item.quantity)}</div>
            </div>
          ))}
          {combinedItems.map((item, i) => (
            <div key={`pos-${i}`} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontWeight: 800, color: 'black' }}>
              <div style={{ width: '55%', fontWeight: 800 }}>{item.order.product_name}</div>
              <div style={{ width: '15%', textAlign: 'right', fontWeight: 800 }}>{item.qty_sold}</div>
              <div style={{ width: '15%', textAlign: 'right', fontWeight: 800 }}>{this.formatCurrency(item.selling_price)}</div>
              <div style={{ width: '15%', textAlign: 'right', fontWeight: 800 }}>{this.formatCurrency(item.selling_price * item.qty_sold)}</div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px dashed #000', marginTop: 6, marginBottom: 6 }} />

        <div style={{ fontSize: 13, color: 'black' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: 13 }}>
            <div>Subtotal</div>
            <div>{invoice.currency}{this.formatCurrency(subtotal)}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <div>VAT ({vatRate}% )</div>
            <div>{invoice.currency}{this.formatCurrency(vatAmount)}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: 14, marginTop: 6 }}>
            <div>Total</div>
            <div>{invoice.currency}{this.formatCurrency(totalWithVat)}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <div>Amount Received</div>
            <div>{invoice.currency}{this.formatCurrency(amountReceived)}</div>
          </div>
          {computedBalance > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <div style={{ fontWeight: 900 }}>Balance</div>
              <div style={{ fontWeight: 900 }}>{invoice.currency}{this.formatCurrency(computedBalance)}</div>
            </div>
          )}
          {prevBal > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <div style={{ fontWeight: 900 }}>Prev Balance</div>
              <div style={{ fontWeight: 900 }}>{invoice.currency}{this.formatCurrency(prevBal)}</div>
            </div>
          )}
          {totalBal > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: 14 }}>
              <div>Total Balance</div>
              <div>{invoice.currency}{this.formatCurrency(totalBal)}</div>
            </div>
          )}
        </div>

        <div style={{ borderTop: '1px dashed #000', marginTop: 6, marginBottom: 6 }} />

        <div style={{ textAlign: 'center', fontSize: 10 }}>
          {company?.invoice_footer_one}
          <br />
          {company?.invoice_footer_two}
          <br />
          Cashier: {invoice.cashier_name}
        </div>
      </div>
    );
  }
}

export default Invoice;
