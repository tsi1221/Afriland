import React, { useState } from "react";
import classNames from "classnames";
import { Line, Bar } from "react-chartjs-2";
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Label,
  FormGroup,
  Input,
  Table,
  Row,
  Col,
  UncontrolledTooltip,
} from "reactstrap";

import {
  chartExample1,
  chartExample2,
  chartExample3,
  chartExample4,
} from "../variables/charts";

function Rtl() {
  const [bigChartData, setBigChartData] = useState("data1");

  return (
    <div className="content">
      {/* Main Performance Chart */}
      <Row>
        <Col xs="12">
          <Card className="card-chart">
            <CardHeader>
              <Row>
                <Col className="text-right" sm="6">
                  <h5 className="card-category">مجموع الشحنات</h5>
                  <CardTitle tag="h2">أداء</CardTitle>
                </Col>
                <Col sm="6">
                  <ButtonGroup className="btn-group-toggle float-left">
                    {["data1", "data2", "data3"].map((data, idx) => {
                      const labels = ["حسابات", "المشتريات", "جلسات"];
                      const icons = [
                        "tim-icons icon-single-02",
                        "tim-icons icon-gift-2",
                        "tim-icons icon-tap-02",
                      ];
                      return (
                        <Button
                          key={idx}
                          tag="label"
                          color="info"
                          size="sm"
                          className={classNames("btn-simple", {
                            active: bigChartData === data,
                          })}
                          onClick={() => setBigChartData(data)}
                        >
                          <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                            {labels[idx]}
                          </span>
                          <span className="d-block d-sm-none">
                            <i className={icons[idx]} />
                          </span>
                        </Button>
                      );
                    })}
                  </ButtonGroup>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <div className="chart-area">
                <Line
                  data={chartExample1[bigChartData]}
                  options={chartExample1.options}
                />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Secondary Charts */}
      <Row>
        {[chartExample2, chartExample3, chartExample4].map((chart, idx) => {
          const titles = ["شحنات كاملة", "المبيعات اليومية", "المهام المكتملة"];
          const icons = [
            "tim-icons icon-bell-55 text-primary",
            "tim-icons icon-delivery-fast text-info",
            "tim-icons icon-send text-success",
          ];
          const values = ["763,215", "3,500€", "12,100K"];
          const ChartComponent = idx === 1 ? Bar : Line;

          return (
            <Col key={idx} className="text-right" lg="4">
              <Card className="card-chart">
                <CardHeader>
                  <h5 className="card-category">{titles[idx]}</h5>
                  <CardTitle tag="h3">
                    <i className={icons[idx]} /> {values[idx]}
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <ChartComponent data={chart.data} options={chart.options} />
                  </div>
                </CardBody>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Tasks Table */}
      <Row>
        <Col className="text-center" lg="6" sm="6">
          <Card className="card-tasks text-left">
            <CardHeader className="text-right">
              <h6 className="title d-inline">تتبع</h6>
              <p className="card-category d-inline">اليوم</p>
              <UncontrolledDropdown className="float-left">
                <DropdownToggle caret color="link">
                  <i className="tim-icons icon-settings-gear-63" />
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>عمل</DropdownItem>
                  <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>عمل آخر</DropdownItem>
                  <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>شيء آخر هنا</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </CardHeader>
            <CardBody>
              <div className="table-full-width table-responsive">
                <Table>
                  <tbody>
                    {/* Example Rows */}
                    {[
                      {
                        title: "مركز معالجة موقع محور",
                        desc: "نص آخر هناالوثائق",
                        checked: true,
                      },
                      {
                        title: "لامتثال GDPR",
                        desc: "الناتج المحلي الإجمالي هو نظام يتطلب حماية البيانات الشخصية...",
                      },
                      {
                        title: "القضاياالقضايا",
                        desc: "سيكونونقال 50٪ من جميع المستجيبين أنهم سيكونون أكثر عرضة للتسوق...",
                      },
                      {
                        title: "تصدير الملفات التي تمت معالجتها",
                        desc: "كما يبين التقرير أن المستهلكين لن يغفروا شركة بسهولة بمجرد حدوث خرق...",
                        checked: true,
                      },
                    ].map((task, idx) => (
                      <tr key={idx}>
                        <td className="text-center">
                          <FormGroup check>
                            <Label check>
                              <Input defaultChecked={task.checked} type="checkbox" />
                              <span className="form-check-sign">
                                <span className="check" />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td className="text-right">
                          <p className="title">{task.title}</p>
                          <p className="text-muted">{task.desc}</p>
                        </td>
                        <td className="td-actions">
                          <Button color="link" id={`tooltip-${idx}`} type="button">
                            <i className="tim-icons icon-settings" />
                          </Button>
                          <UncontrolledTooltip delay={0} target={`tooltip-${idx}`} placement="right">
                            مهمة تحرير
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* Simple Table */}
        <Col lg="6" sm="6">
          <Card>
            <CardHeader className="text-right">
              <CardTitle tag="h4">جدول بسيط</CardTitle>
            </CardHeader>
            <CardBody>
              <Table className="tablesorter" responsive>
                <thead className="text-primary">
                  <tr>
                    <th>اسم</th>
                    <th>بلد</th>
                    <th>مدينة</th>
                    <th className="text-center">راتب</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "رايس داكوتا", country: "النيجر", city: "العود-تورنهاوت", salary: "$36,738" },
                    { name: "مينيرفا هوبر", country: "كوراساو", city: "Sinaai-واس", salary: "$23,789" },
                    { name: "سيج رودريجيز", country: "هولندا", city: "بايلي", salary: "$56,142" },
                    { name: "فيليب شانيه", country: "كوريا، جنوب", city: "اوفرلاند بارك", salary: "$38,735" },
                    { name: "دوريس غرين", country: "مالاوي", city: "المنع", salary: "$63,542" },
                    { name: "ميسون بورتر", country: "تشيلي", city: "غلوستر", salary: "$78,615" },
                    { name: "جون بورتر", country: "البرتغال", city: "غلوستر", salary: "$98,615" },
                  ].map((person, idx) => (
                    <tr key={idx}>
                      <td>{person.name}</td>
                      <td>{person.country}</td>
                      <td>{person.city}</td>
                      <td className="text-center">{person.salary}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Rtl;
