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

    return (
      <Card style={{ padding: "10px", width: "100%" }}>
        {Object.keys(invoice).length !== 0 && (
          <div>
            <header
              style={{
                textAlign: "center",
                marginBottom: "10px",
                fontSize: "24px",
              }}
            >
              <h1
                style={{
                  fontWeight: 900,
                  color: "black",
                  fontFamily: "monaco, Consolas, Lucida Console, monospace",
                }}
              >
                {company?.name || ""}
              </h1>
              <div
                style={{
                  fontWeight: 900,
                  color: "black",
                  fontFamily: "monaco, Consolas, Lucida Console, monospace",
                }}
              >
                <FontAwesomeIcon icon={faPhone} /> {company.phone_one},{" "}
                {company.phone_two}
              </div>
              <div
                style={{
                  fontWeight: 900,
                  color: "black",
                  fontFamily: "monaco, Consolas, Lucida Console, monospace",
                }}
              >
                <FontAwesomeIcon icon={faGlobe} /> {company.website}
              </div>
            </header>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "30px",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  textAlign: "left",
                  fontWeight: 900,
                  color: "black",
                  fontFamily: "monaco, Consolas, Lucida Console, monospace",
                }}
              >
                Date: {moment(invoice.created_at).format("MMM DD YYYY, h:mm A")}
                <br />
                Invoice #: {invoice.invoice_no}
                <br />
                {company.address}
              </div>
              <div
                style={{
                  textAlign: "right",
                  fontWeight: 900,
                  color: "black",
                  fontFamily: "monaco, Consolas, Lucida Console, monospace",
                }}
              >
                <strong>Customer</strong>
                <br />
                {invoice.client.name}
                <br />
                {invoice.client.phone}
                <br />
                {invoice.client.address}
                <br />
                {invoice.client.email || ""}
              </div>
            </div>

            <Table
              striped
              bordered
              hover
              style={{ marginBottom: "10px", fontSize: "20px" }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      fontSize: "30px",
                      fontWeight: 900,
                      color: "black",
                      fontFamily: "monaco, Consolas, Lucida Console, monospace",
                    }}
                  >
                    Product
                  </th>
                  <th
                    style={{
                      fontSize: "30px",
                      fontWeight: 900,
                      color: "black",
                      fontFamily: "monaco, Consolas, Lucida Console, monospace",
                    }}
                  >
                    Qty
                  </th>
                  <th
                    style={{
                      fontSize: "30px",
                      fontWeight: 900,
                      color: "black",
                      fontFamily: "monaco, Consolas, Lucida Console, monospace",
                    }}
                  >
                    Price
                  </th>
                  <th
                    style={{
                      fontSize: "30px",
                      fontWeight: 900,
                      color: "black",
                      fontFamily: "monaco, Consolas, Lucida Console, monospace",
                    }}
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        fontSize: "30px",
                        textTransform: "uppercase",
                        fontWeight: 900,
                        color: "black",
                        fontFamily:
                          "monaco, Consolas, Lucida Console, monospace",
                        maxWidth: 300,
                        textWrap: "wrap",
                      }}
                    >
                      {item.description}
                    </td>
                    <td
                      style={{
                        fontSize: "30px",
                        fontWeight: 900,
                        color: "black",
                        fontFamily:
                          "monaco, Consolas, Lucida Console, monospace",
                      }}
                    >
                      {item.quantity}
                    </td>
                    <td
                      style={{
                        fontSize: "30px",
                        fontWeight: 900,
                        color: "black",
                        fontFamily:
                          "monaco, Consolas, Lucida Console, monospace",
                      }}
                    >
                      {this.formatCurrency(item.rate)}
                    </td>
                    <td
                      style={{
                        fontSize: "30px",
                        fontWeight: 900,
                        color: "black",
                        fontFamily:
                          "monaco, Consolas, Lucida Console, monospace",
                      }}
                    >
                      {this.formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))}
                {combinedItems.map((item, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        fontSize: "30px",
                        fontWeight: 900,
                        color: "black",
                        fontFamily:
                          "monaco, Consolas, Lucida Console, monospace",
                      }}
                    >
                      {item.order.product_name}
                    </td>
                    <td
                      style={{
                        fontSize: "30px",
                        fontWeight: 900,
                        color: "black",
                        fontFamily:
                          "monaco, Consolas, Lucida Console, monospace",
                      }}
                    >
                      {item.qty_sold}
                    </td>
                    <td
                      style={{
                        fontSize: "30px",
                        fontWeight: 900,
                        color: "black",
                        fontFamily:
                          "monaco, Consolas, Lucida Console, monospace",
                      }}
                    >
                      {this.formatCurrency(item.selling_price)}
                    </td>
                    <td
                      style={{
                        fontSize: "30px",
                        fontWeight: 900,
                        color: "black",
                        fontFamily:
                          "monaco, Consolas, Lucida Console, monospace",
                      }}
                    >
                      {this.formatCurrency(item.selling_price * item.qty_sold)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <div
              style={{
                fontWeight: 900,
                color: "black",
                fontFamily: "monaco, Consolas, Lucida Console, monospace",
                fontSize: "30px",
                textAlign: "right",
                marginBottom: "10px",
              }}
            >
              Total: {invoice.currency}
              {this.formatCurrency2(invoice.amount)}
              <br />
              Paid: {invoice.currency}
              {this.formatCurrency2(invoice.amount_paid)}
              <br />
              {invoice.amount - invoice.amount_paid > 0 && (
                <>
                  Balance: {invoice.currency}
                  {invoice.amount - invoice.amount_paid}
                </>
              )}
              <br />
              {/* VAT display */}
              VAT ({invoice.vat_rate || 0}%): {invoice.currency}{this.formatCurrency2(invoice.vat_amount || 0)}
              <br />
              {prev_balance > 0 && (
                <>
                  Previous Balance: {invoice.currency}
                  {prev_balance}
                </>
              )}
              <br />
              {total_balance > 0 && (
                <>
                  Total Balance: {invoice.currency}
                  {this.formatCurrency2(total_balance)}
                </>
              )}
            </div>

            <footer
              style={{
                fontSize: "30px",
                marginTop: "10px",
                textAlign: "center",
                fontWeight: 900,
                color: "black",
                fontFamily: "monaco, Consolas, Lucida Console, monospace",
              }}
            >
              <div>{company?.invoice_footer_one}</div>
              <div>{company?.invoice_footer_two}</div>
              <div
                style={{
                  fontWeight: 900,
                  color: "black",
                  fontFamily: "monaco, Consolas, Lucida Console, monospace",
                  marginTop: "10px",
                }}
              >
                Cashier: {invoice.cashier_name}
              </div>
            </footer>
          </div>
        )}
      </Card>
    );
  }
}

export default Invoice;
