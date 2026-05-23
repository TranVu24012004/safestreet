import React, { useEffect, useMemo, useRef, useState } from "react";
import "./ViewFeed.css";
import {
  AlertCircle,
  ArrowUpDown,
  Calendar,
  Check,
  CheckCircle,
  ChevronDown,
  Clock,
  Inbox,
  Loader2,
  Mail,
  MessageSquare,
  RefreshCw,
  Search,
  Send,
  Trash2,
  User,
  X,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { BACKEND_URL } from "../utils/apiConfig";

const STATUS_LABELS = {
  pending: "Đang chờ",
  completed: "Đã hoàn thành",
};

const ViewFeed = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "dateSubmitted",
    direction: "desc",
  });
  const [replyModal, setReplyModal] = useState({ open: false, feedback: null });
  const [replyText, setReplyText] = useState("");
  const [busyKey, setBusyKey] = useState("");
  const [notification, setNotification] = useState({
    show: false,
    type: "success",
    message: "",
  });
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const notificationTimerRef = useRef(null);

  useEffect(() => {
    setUserId(localStorage.getItem("roadVisionUserId") || "");
    setUserName(localStorage.getItem("roadVisionUserName") || "");
    fetchFeedbacks();

    return () => {
      if (notificationTimerRef.current) {
        clearTimeout(notificationTimerRef.current);
      }
    };
  }, []);

  const showNotification = (message, type = "success") => {
    if (notificationTimerRef.current) {
      clearTimeout(notificationTimerRef.current);
    }

    setNotification({ show: true, message, type });
    notificationTimerRef.current = setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 5000);
  };

  const readApiError = async (response, fallbackMessage) => {
    try {
      const data = await response.json();
      return data?.error || data?.message || fallbackMessage;
    } catch {
      return fallbackMessage;
    }
  };

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${BACKEND_URL}/api/feedbacks`);
      if (!response.ok) {
        throw new Error(await readApiError(response, "Không thể tải danh sách phản ánh."));
      }

      const data = await response.json();
      const normalized = Array.isArray(data)
        ? data.map((feedback) => ({
            ...feedback,
            completed: Boolean(feedback.completed),
            replied: Boolean(feedback.replied),
          }))
        : [];

      setFeedbacks(normalized);
    } catch (fetchError) {
      console.error("Error fetching feedbacks:", fetchError);
      setError(fetchError.message || "Không thể tải danh sách phản ánh.");
    } finally {
      setLoading(false);
    }
  };

  const filteredFeedbacks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const result = feedbacks
      .filter((feedback) => {
        if (statusFilter === "completed" && !feedback.completed) {
          return false;
        }

        if (statusFilter === "pending" && feedback.completed) {
          return false;
        }

        if (!query) {
          return true;
        }

        return [
          feedback.name,
          feedback.email,
          feedback.subject,
          feedback.message,
        ]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query));
      })
      .sort((firstItem, secondItem) => {
        const firstValue = firstItem?.[sortConfig.key];
        const secondValue = secondItem?.[sortConfig.key];

        const normalizedFirst =
          sortConfig.key === "dateSubmitted"
            ? new Date(firstValue || 0).getTime()
            : String(firstValue || "").toLowerCase();
        const normalizedSecond =
          sortConfig.key === "dateSubmitted"
            ? new Date(secondValue || 0).getTime()
            : String(secondValue || "").toLowerCase();

        if (normalizedFirst < normalizedSecond) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }

        if (normalizedFirst > normalizedSecond) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }

        return 0;
      });

    return result;
  }, [feedbacks, searchQuery, sortConfig, statusFilter]);

  const toggleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const formatDate = (value) => {
    if (!value) {
      return "Chưa có thời gian";
    }

    return new Date(value).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const sendUserNotification = async (payload) => {
    try {
      await fetch(`${BACKEND_URL}/api/user-notification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (notificationError) {
      console.error("Notification error:", notificationError);
    }
  };

  const handleStatusChange = async (feedback, nextCompletedValue) => {
    const nextLabel = nextCompletedValue
      ? STATUS_LABELS.completed
      : STATUS_LABELS.pending;
    const confirmed = window.confirm(
      `Bạn có chắc muốn đổi trạng thái phản ánh "${feedback.subject}" thành "${nextLabel}" không?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setBusyKey(`status-${feedback._id}`);

      const response = await fetch(`${BACKEND_URL}/api/feedbacks/${feedback._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          completed: nextCompletedValue,
          userId: feedback.userId,
        }),
      });

      if (!response.ok) {
        throw new Error(
          await readApiError(response, "Không thể cập nhật trạng thái phản ánh.")
        );
      }

      const updatedFeedback = await response.json();
      setFeedbacks((current) =>
        current.map((item) =>
          item._id === feedback._id
            ? { ...item, ...updatedFeedback, completed: Boolean(updatedFeedback.completed) }
            : item
        )
      );

      if (feedback.userId) {
        void sendUserNotification({
          userId: feedback.userId,
          title: "Trạng thái phản ánh đã được cập nhật",
          message: `Phản ánh "${feedback.subject}" đã được chuyển sang trạng thái "${nextLabel}".`,
          type: "feedback_status",
          details: {
            feedbackId: feedback._id,
            status: nextCompletedValue ? "completed" : "pending",
            subject: feedback.subject,
          },
        });
      }

      showNotification(`Đã cập nhật trạng thái thành "${nextLabel}".`);
    } catch (statusError) {
      console.error("Error updating feedback status:", statusError);
      showNotification(
        statusError.message || "Không thể cập nhật trạng thái phản ánh.",
        "error"
      );
    } finally {
      setBusyKey("");
    }
  };

  const openReplyModal = (feedback) => {
    setReplyModal({ open: true, feedback });
    setReplyText(feedback.replyText || "");
  };

  const closeReplyModal = () => {
    setReplyModal({ open: false, feedback: null });
    setReplyText("");
  };

  const handleSendReply = async () => {
    const currentFeedback = replyModal.feedback;

    if (!currentFeedback || !replyText.trim()) {
      return;
    }

    try {
      setBusyKey(`reply-${currentFeedback._id}`);

      const response = await fetch(
        `${BACKEND_URL}/api/feedbacks/${currentFeedback._id}/reply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            replyText: replyText.trim(),
            recipientEmail: currentFeedback.email,
            recipientName: currentFeedback.name,
            userId: currentFeedback.userId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(await readApiError(response, "Không thể gửi phản hồi."));
      }

      const result = await response.json();
      const updatedFeedback = result.feedback || {
        ...currentFeedback,
        replyText: replyText.trim(),
        replyDate: new Date().toISOString(),
        replied: true,
        completed: true,
      };

      setFeedbacks((current) =>
        current.map((item) =>
          item._id === currentFeedback._id
            ? {
                ...item,
                ...updatedFeedback,
                replied: true,
                completed: true,
              }
            : item
        )
      );

      if (currentFeedback.userId) {
        void sendUserNotification({
          userId: currentFeedback.userId,
          title: "Bạn đã nhận được phản hồi mới",
          message: `Phản ánh "${currentFeedback.subject}" đã có phản hồi từ quản trị viên.`,
          type: "feedback_reply",
          details: {
            feedbackId: currentFeedback._id,
            subject: currentFeedback.subject,
            replyText: replyText.trim(),
            replyDate: updatedFeedback.replyDate || new Date().toISOString(),
          },
        });
      }

      closeReplyModal();
      showNotification(
        result.emailSent === false
          ? "Đã lưu phản hồi và cập nhật trạng thái. Email chưa được gửi do cấu hình máy chủ."
          : "Đã gửi phản hồi thành công."
      );
    } catch (replyError) {
      console.error("Error sending reply:", replyError);
      showNotification(replyError.message || "Không thể gửi phản hồi.", "error");
    } finally {
      setBusyKey("");
    }
  };

  const handleDeleteFeedback = async (feedback) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa phản ánh "${feedback.subject}" không? Hành động này không thể hoàn tác.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setBusyKey(`delete-${feedback._id}`);

      const response = await fetch(`${BACKEND_URL}/api/feedbacks/${feedback._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(await readApiError(response, "Không thể xóa phản ánh."));
      }

      setFeedbacks((current) => current.filter((item) => item._id !== feedback._id));
      showNotification("Đã xóa phản ánh thành công.");
    } catch (deleteError) {
      console.error("Error deleting feedback:", deleteError);
      showNotification(deleteError.message || "Không thể xóa phản ánh.", "error");
    } finally {
      setBusyKey("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-green-700">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="font-medium">Đang tải danh sách phản ánh...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl border border-red-100 shadow-sm p-6 flex items-center gap-3 text-red-600">
          <AlertCircle className="h-6 w-6" />
          <div>
            <p className="font-semibold">Không tải được dữ liệu</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab="View Feedbacks" userName={userName} userId={userId} />

      <div className="flex-1 ml-64">
        {notification.show && (
          <div
            className={`fixed top-4 right-4 z-50 flex items-start gap-3 rounded-xl px-4 py-3 shadow-lg transition-all ${
              notification.type === "error"
                ? "bg-red-600 text-white"
                : "bg-green-600 text-white"
            }`}
            style={{ maxWidth: "420px" }}
          >
            {notification.type === "error" ? (
              <AlertCircle className="h-5 w-5 mt-0.5" />
            ) : (
              <CheckCircle className="h-5 w-5 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="font-semibold">
                {notification.type === "error" ? "Không thành công" : "Thành công"}
              </p>
              <p className="text-sm">{notification.message}</p>
            </div>
            <button
              onClick={() => setNotification((current) => ({ ...current, show: false }))}
              className="rounded-full bg-white/10 p-1 hover:bg-white/20"
              aria-label="Đóng thông báo"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <header className="bg-gradient-to-r from-green-600 to-emerald-700 px-8 py-8 text-white shadow-md">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Quản lý phản ánh</h1>
              <p className="mt-2 text-sm text-green-50">
                Theo dõi phản ánh, cập nhật trạng thái hoàn thành và gửi phản hồi cho người dùng.
              </p>
            </div>
            <button
              onClick={fetchFeedbacks}
              className="inline-flex items-center justify-center rounded-lg bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Tải lại dữ liệu
            </button>
          </div>
        </header>

        <main className="p-8">
          <div className="mb-6 grid gap-4 rounded-2xl bg-white p-5 shadow-sm border border-gray-100 lg:grid-cols-[1.5fr_240px]">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Tìm kiếm</label>
              <div className="relative">
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Tìm theo người gửi, email, tiêu đề hoặc nội dung..."
                  className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-10 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    aria-label="Xóa từ khóa"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Trạng thái</label>
              <div className="relative">
                <ArrowUpDown className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-10 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="pending">Đang chờ</option>
                  <option value="completed">Đã hoàn thành</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center text-xl font-semibold text-gray-900">
              <span className="mr-3 rounded-lg bg-green-100 p-2">
                <Inbox className="h-5 w-5 text-green-700" />
              </span>
              Danh sách phản ánh
            </h2>
            <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
              {filteredFeedbacks.length}/{feedbacks.length} mục
            </span>
          </div>

          {filteredFeedbacks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
              <Inbox className="mx-auto h-10 w-10 text-green-500" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Không có phản ánh phù hợp
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Hãy thay đổi từ khóa tìm kiếm hoặc bộ lọc để xem thêm dữ liệu.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-green-50">
                    <tr>
                      <th
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700 cursor-pointer"
                        onClick={() => toggleSort("name")}
                      >
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-green-700" />
                          Người gửi
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700 cursor-pointer"
                        onClick={() => toggleSort("subject")}
                      >
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-green-700" />
                          Nội dung
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700 cursor-pointer"
                        onClick={() => toggleSort("dateSubmitted")}
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-green-700" />
                          Ngày gửi
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-green-700" />
                          Trạng thái
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">
                        Thao tác
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredFeedbacks.map((feedback, index) => {
                      const statusBusy = busyKey === `status-${feedback._id}`;
                      const replyBusy = busyKey === `reply-${feedback._id}`;
                      const deleteBusy = busyKey === `delete-${feedback._id}`;
                      const initial = feedback.name?.charAt(0)?.toUpperCase() || "?";

                      return (
                        <tr
                          key={feedback._id}
                          className={index % 2 === 0 ? "bg-white" : "bg-gray-50/70"}
                        >
                          <td className="px-4 py-4 align-top">
                            <div className="flex items-start gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 font-semibold text-green-700">
                                {initial}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">
                                  {feedback.name || "Người dùng"}
                                </p>
                                <p className="mt-1 flex items-center text-sm text-gray-500">
                                  <Mail className="mr-1 h-3.5 w-3.5 text-green-600" />
                                  {feedback.email || "Chưa có email"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 align-top">
                            <p className="text-sm font-semibold text-gray-900">
                              {feedback.subject || "Không có tiêu đề"}
                            </p>
                            <p className="mt-1 max-w-xl whitespace-pre-line text-sm text-gray-600">
                              {feedback.message || "Không có nội dung"}
                            </p>
                            {feedback.replied && feedback.replyDate && (
                              <p className="mt-2 text-xs font-medium text-green-700">
                                Đã phản hồi lúc {formatDate(feedback.replyDate)}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-4 align-top text-sm text-gray-700">
                            {formatDate(feedback.dateSubmitted)}
                          </td>
                          <td className="px-4 py-4 align-top">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                                feedback.completed
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              <span
                                className={`mr-2 h-2 w-2 rounded-full ${
                                  feedback.completed ? "bg-green-600" : "bg-yellow-500"
                                }`}
                              />
                              {feedback.completed
                                ? STATUS_LABELS.completed
                                : STATUS_LABELS.pending}
                            </span>
                          </td>
                          <td className="px-4 py-4 align-top">
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() =>
                                  handleStatusChange(feedback, !feedback.completed)
                                }
                                disabled={Boolean(busyKey)}
                                className={`inline-flex items-center rounded-lg px-3 py-2 text-xs font-medium transition ${
                                  feedback.completed
                                    ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                                    : "bg-green-600 text-white hover:bg-green-700"
                                } disabled:cursor-not-allowed disabled:opacity-60`}
                              >
                                {statusBusy ? (
                                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Check className="mr-1.5 h-3.5 w-3.5" />
                                )}
                                {feedback.completed
                                  ? "Chuyển về đang chờ"
                                  : "Đánh dấu hoàn thành"}
                              </button>

                              <button
                                onClick={() => openReplyModal(feedback)}
                                disabled={Boolean(busyKey)}
                                className="inline-flex items-center rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {replyBusy ? (
                                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Send className="mr-1.5 h-3.5 w-3.5" />
                                )}
                                Trả lời
                              </button>

                              <button
                                onClick={() => handleDeleteFeedback(feedback)}
                                disabled={Boolean(busyKey)}
                                className="inline-flex items-center rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {deleteBusy ? (
                                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                                )}
                                Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {replyModal.open && replyModal.feedback && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          style={{ paddingLeft: "16rem" }}
        >
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between rounded-t-2xl bg-green-600 px-6 py-4 text-white">
              <div>
                <h3 className="text-lg font-semibold">Trả lời phản ánh</h3>
                <p className="text-sm text-green-50">
                  Phản hồi sẽ được lưu vào hệ thống và gửi thông báo cho người dùng.
                </p>
              </div>
              <button
                onClick={closeReplyModal}
                className="rounded-full bg-white/10 p-2 hover:bg-white/20"
                aria-label="Đóng cửa sổ phản hồi"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-5 px-6 py-5">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-900">
                  {replyModal.feedback.subject}
                </p>
                <p className="mt-2 text-sm text-gray-600 whitespace-pre-line">
                  {replyModal.feedback.message}
                </p>
                <div className="mt-3 grid gap-2 text-xs text-gray-500 sm:grid-cols-2">
                  <p>Người gửi: {replyModal.feedback.name || "Người dùng"}</p>
                  <p>Email: {replyModal.feedback.email || "Chưa có email"}</p>
                  <p>Ngày gửi: {formatDate(replyModal.feedback.dateSubmitted)}</p>
                  <p>
                    Trạng thái hiện tại:{" "}
                    {replyModal.feedback.completed
                      ? STATUS_LABELS.completed
                      : STATUS_LABELS.pending}
                  </p>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Nội dung phản hồi
                </label>
                <textarea
                  value={replyText}
                  onChange={(event) => setReplyText(event.target.value)}
                  rows={6}
                  placeholder="Nhập nội dung phản hồi cho người dùng..."
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
                <p className="mt-2 text-right text-xs text-gray-500">
                  {replyText.trim().length} ký tự
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 rounded-b-2xl border-t border-gray-100 bg-gray-50 px-6 py-4">
              <button
                onClick={closeReplyModal}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSendReply}
                disabled={!replyText.trim() || Boolean(busyKey)}
                className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busyKey === `reply-${replyModal.feedback._id}` ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Gửi phản hồi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewFeed;
