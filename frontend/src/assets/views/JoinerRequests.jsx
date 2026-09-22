import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import {
    Table,
    Button,
    Space,
    Input,
    Modal,
    Select,
    Card,
    Tag,
    Tooltip,
    message,
    Pagination,
} from "antd";
import {
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    FileTextOutlined,
    UploadOutlined,
    FilePdfOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2";
import { useStateContext } from "../contexts/ContextProvider";
import { useLanguage } from "../locale/LanguageContext";
import StatusPill from "../components/StatusPill";
import ErrorHandling from "../components/ErrorHandling";
import PdfStateButton from "../components/PdfStateButton";

const { Search } = Input;

export default function JoinerRequests() {
    const { user } = useStateContext();
    const { translate } = useLanguage();
    const [joinerRequests, setJoinerRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [selectedType, setSelectedType] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedPdfState, setSelectedPdfState] = useState(null);

    // Modal states
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    useEffect(() => {
        getJoinerRequests();
    }, [currentPage, pageSize, searchText, selectedType, selectedState, selectedPdfState]);

    const getJoinerRequests = async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage,
                per_page: pageSize,
            };

            // Search by joiner name or description
            if (searchText) {
                params.search = searchText;
            }
            if (selectedType !== null) {
                params.type = selectedType;
            }
            if (selectedState !== null) {
                params.state = selectedState;
            }
            if (selectedPdfState !== null) {
                params.pdf_state = selectedPdfState;
            }

            // Use establishment-based endpoint for admin/manager
            const endpoint = user?.etablissement_id
                ? `/joiner-requests/establishment/${user.etablissement_id}`
                : '/joiner-requests';

            const response = await axiosClient.get(endpoint, { params });

            // Handle different response structures
            if (response.data.success) {
                setJoinerRequests(response.data.data);
                setTotal(response.data.total || 0);
            } else {
                setJoinerRequests(response.data.data || []);
                setTotal(response.data.meta?.total || 0);
            }
        } catch (error) {
            console.error("Error fetching joiner requests:", error);
            ErrorHandling(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (value) => {
        setSearchText(value);
        setCurrentPage(1);
    };

    const handleTypeFilter = (value) => {
        setSelectedType(value);
        setCurrentPage(1);
    };

    const handleStateFilter = (value) => {
        setSelectedState(value);
        setCurrentPage(1);
    };

    const handlePdfStateFilter = (value) => {
        setSelectedPdfState(value);
        setCurrentPage(1);
    };

    const showDetailsModal = (record) => {
        setSelectedRequest(record);
        setDetailsModalVisible(true);
    };

    const handleDetailsModalClose = () => {
        setDetailsModalVisible(false);
        setSelectedRequest(null);
    };

    const updateRequestState = async (requestId, newState) => {
        try {
            const response = await axiosClient.put(
                `/joiner-requests/${requestId}`,
                {
                    state: newState,
                }
            );

            if (response.data.success) {
                message.success("تم تحديث حالة الطلب بنجاح");
                getJoinerRequests();
            }
        } catch (error) {
            console.error("Error updating request state:", error);
            message.error("حدث خطأ أثناء تحديث حالة الطلب");
            ErrorHandling(error);
        }
    };

    const deleteRequest = async (requestId) => {
        Swal.fire({
            title: "هل أنت متأكد؟",
            text: "لن تتمكن من التراجع عن هذا الإجراء!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "نعم، احذف!",
            cancelButtonText: "إلغاء",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosClient.delete(`/joiner-requests/${requestId}`);
                    message.success("تم حذف الطلب بنجاح");
                    getJoinerRequests();
                } catch (error) {
                    console.error("Error deleting request:", error);
                    message.error("حدث خطأ أثناء حذف الطلب");
                    ErrorHandling(error);
                }
            }
        });
    };

    const updatePdfRequestState = async (requestId, newPdfState) => {
        try {
            const response = await axiosClient.put(
                `/joiner-requests/${requestId}/pdf-state`,
                {
                    pdf_state: newPdfState,
                }
            );

            if (response.data.success) {
                message.success("تم تحديث حالة الملف بنجاح");
                getJoinerRequests();
            }
        } catch (error) {
            console.error("Error updating PDF state:", error);
            message.error("حدث خطأ أثناء تحديث حالة الملف");
            ErrorHandling(error);
        }
    };

    const getPdfStateColor = (pdfState) => {
        const pdfStateColors = {
            0: "#d9d9d9", // لم يتم رفع ملف
            1: "#1890ff", // تم رفع ملف
            2: "#52c41a", // تم قبول الملف
        };
        return pdfStateColors[pdfState] || "#d9d9d9";
    };

    const getPdfStateLabel = (pdfState) => {
        const pdfStateLabels = {
            0: translate("not_uploaded") || "لم يتم رفع ملف",
            1: translate("uploaded") || "تم رفع ملف",
            2: translate("accepted") || "تم قبول الملف",
        };
        return pdfStateLabels[pdfState] || translate("not_specified") || "غير محدد";
    };

    const getStateColor = (state) => {
        const stateColors = {
            0: "#1890ff", // تم الإرسال
            1: "#52c41a", // تم الحضور
            2: "#ff4d4f", // تم الإلغاء
        };
        return stateColors[state] || "#d9d9d9";
    };

    const getStateLabel = (state) => {
        const stateLabels = {
            0: translate("sent") || "تم الإرسال",
            1: translate("attended") || "تم الحضور",
            2: translate("cancelled") || "تم الإلغاء",
        };
        return stateLabels[state] || translate("not_specified") || "غير محدد";
    };

    const getTypeLabel = (type) => {
        return type == 0 ? (translate("summon_order") || "أمر بإستدعاء") : (translate("file_order") || "إدراج ملف");
    };

    const columns = [
        {
            title: translate("joiner_name") || "المنخرط",
            key: "joiner",
            render: (text, record) => (
                <div>
                    <div style={{ fontWeight: "bold" }}>
                        {record.joiner?.nom_ar} {record.joiner?.prenom_ar}
                    </div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                        {record.joiner?.email}
                    </div>
                    {record.joiner?.telephone && (
                        <div style={{ fontSize: "12px", color: "#666" }}>
                            {record.joiner?.telephone}
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: translate("request_description") || "الوصف",
            dataIndex: "description",
            key: "description",
            render: (description) => (
                <div style={{ maxWidth: "200px" }}>
                    {description || '-'}
                </div>
            ),
        },
        {
            title: translate("request_type") || "نوع الطلب",
            dataIndex: "type",
            key: "type",
            render: (type) => (
                <Tag color={type == 0 ? "blue" : "green"}>
                    {getTypeLabel(type)}
                </Tag>
            ),
        },

        {
            title: translate("request_state") || "الحالة",
            dataIndex: "state",
            key: "state",
            render: (state) => (
                <StatusPill
                    text={getStateLabel(state)}
                    color={getStateColor(state)}
                    bg={`${getStateColor(state)}20`}
                />
            ),
        },

        selectedType == 1 && {
            title: translate("pdf_state") || "حالة الملف",
            key: "pdf_state",
            render: (text, record) => (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "8px",
                    }}
                >
                    <StatusPill
                        text={getPdfStateLabel(record.pdf_state)}
                        color={getPdfStateColor(record.pdf_state)}
                        bg={`${getPdfStateColor(record.pdf_state)}20`}
                    />
                    <PdfStateButton
                        currentState={record.pdf_state}
                        onChange={(state) => updatePdfRequestState(record.id, state)}
                        disabled={record.type == 0} // Disable for type 0 (summon orders)
                    />
                </div>
            ),
        },
        selectedType == 1 && {
            title: "الملف",
            key: "pdf",
            render: (text, record) => {
                if (record.pdf_path) {
                    const pdfUrl = `${axiosClient.defaults.baseURL}/storage/${record.pdf_path}`.replace('/api/', '/');
                    return (
                        <Button
                            type="primary"
                            icon={<FilePdfOutlined />}
                            size="small"
                            onClick={() => window.open(pdfUrl, "_blank")}
                        >
                            عرض
                        </Button>
                    );
                } else {
                    return (
                        <span style={{ color: "#bbb", fontSize: "12px" }}>
                            لا يوجد ملف
                        </span>
                    );
                }
            },
        },
        {
            title: "العمليات",
            key: "actions",
            render: (text, record) => (
                <Space size="small">
                    <Button
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => showDetailsModal(record)}
                    />

                    {record.state == 0 && (
                        <>
                            {record.type == 0 && (
                                <Button
                                    type="primary"
                                    size="small"
                                    onClick={() =>
                                        updateRequestState(record.id, 1)
                                    }
                                >
                                    تم الحضور
                                </Button>
                            )}

                            <Button
                                danger
                                size="small"
                                onClick={() => updateRequestState(record.id, 2)}
                            >
                                إلغاء
                            </Button>
                        </>
                    )}

                    {record.state == 0 && (
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                            onClick={() => deleteRequest(record.id)}
                        />
                    )}
                </Space>
            ),
        },
    ].filter(Boolean);

    return (
        <div style={{ padding: "20px" }}>
            <Card
                title="طلبات المنخرطين"
                extra={
                    <Space>
                        <Search
                            placeholder="البحث باسم المنخرط أو الوصف..."
                            allowClear
                            onSearch={handleSearch}
                            style={{ width: 250 }}
                        />
                        <Select
                            placeholder="نوع الطلب"
                            allowClear
                            style={{ width: 150 }}
                            onChange={handleTypeFilter}
                        >
                            <Select.Option value={0}>
                                أمر بإستدعاء
                            </Select.Option>
                            <Select.Option value={1}>إدراج ملف</Select.Option>
                        </Select>
                        <Select
                            placeholder="الحالة"
                            allowClear
                            style={{ width: 120 }}
                            onChange={handleStateFilter}
                        >
                            <Select.Option value={0}>تم الإرسال</Select.Option>
                            <Select.Option value={1}>تم الحضور</Select.Option>
                            <Select.Option value={2}>تم الإلغاء</Select.Option>
                        </Select>
                        <Select
                            placeholder="حالة الملف"
                            allowClear
                            style={{ width: 120 }}
                            onChange={handlePdfStateFilter}
                        >
                            <Select.Option value={0}>لم يتم رفع ملف</Select.Option>
                            <Select.Option value={1}>تم رفع ملف</Select.Option>
                            <Select.Option value={2}>تم قبول الملف</Select.Option>
                        </Select>
                    </Space>
                }
            >
                <Table
                    columns={columns}
                    dataSource={joinerRequests}
                    loading={loading}
                    rowKey="id"
                    pagination={false}
                    scroll={{ x: "max-content" }}
                />

                <div style={{ marginTop: 16, textAlign: "center" }}>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={total}
                        showSizeChanger
                        showQuickJumper
                        showTotal={(total, range) =>
                            `${range[0]}-${range[1]} من ${total} عنصر`
                        }
                        onChange={(page, size) => {
                            setCurrentPage(page);
                            setPageSize(size);
                        }}
                        pageSizeOptions={["10", "25", "50", "100"]}
                    />
                </div>
            </Card>

            {/* Details Modal */}
            <Modal
                title="تفاصيل الطلب"
                open={detailsModalVisible}
                onCancel={handleDetailsModalClose}
                footer={[
                    <Button key="close" onClick={handleDetailsModalClose}>
                        إغلاق
                    </Button>,
                ]}
                style={{ direction: "rtl" }}
                width={600}
            >
                {selectedRequest && (
                    <div>
                        <div style={{ marginBottom: 16 }}>
                            <h4>معلومات المنخرط:</h4>
                            <p>
                                <strong>الاسم:</strong>{" "}
                                {selectedRequest.joiner?.nom_ar}{" "}
                                {selectedRequest.joiner?.prenom_ar}
                            </p>
                            <p>
                                <strong>البريد الإلكتروني:</strong>{" "}
                                {selectedRequest.joiner?.email}
                            </p>
                            {selectedRequest.joiner?.telephone && (
                                <p>
                                    <strong>رقم الهاتف:</strong>{" "}
                                    {selectedRequest.joiner?.telephone}
                                </p>
                            )}
                        </div>

                        <div style={{ marginBottom: 16 }}>
                            <h4>وصف الطلب:</h4>
                            <p>{selectedRequest.description || 'لا يوجد وصف'}</p>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                            <h4>تفاصيل الطلب:</h4>
                            <p>
                                <strong>النوع:</strong>{" "}
                                {getTypeLabel(selectedRequest.type)}
                            </p>
                            <p>
                                <strong>الحالة:</strong>{" "}
                                {getStateLabel(selectedRequest.state)}
                            </p>
                            {selectedRequest.type == 1 && (
                                <p>
                                    <strong>حالة الملف:</strong>{" "}
                                    <StatusPill
                                        text={getPdfStateLabel(
                                            selectedRequest.pdf_state
                                        )}
                                        color={getPdfStateColor(
                                            selectedRequest.pdf_state
                                        )}
                                        bg={`${getPdfStateColor(
                                            selectedRequest.pdf_state
                                        )}20`}
                                    />
                                </p>
                            )}
                            <p>
                                <strong>الوصف:</strong>
                            </p>
                            <div
                                style={{
                                    padding: 12,
                                    backgroundColor: "#f5f5f5",
                                    borderRadius: 6,
                                    whiteSpace: "pre-wrap",
                                }}
                            >
                                {selectedRequest.description}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
