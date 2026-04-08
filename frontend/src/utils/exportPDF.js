import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Exports the student's study plan + quiz scores as a PDF report.
 * @param {object} opts
 * @param {string} opts.username
 * @param {string} opts.subject
 * @param {string} opts.level
 * @param {number} opts.days
 * @param {number} opts.hours
 * @param {Array}  opts.plan        - array of { day, topics: [{ name, completed, verified, quizScore, hours }] }
 * @param {Array}  opts.dailyScores - array of { date, score }
 */
export function exportStudyPlanPDF({ username, subject, level, days, hours, plan, dailyScores = [] }) {
  const doc  = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W    = doc.internal.pageSize.getWidth();
  const primary   = [15, 118, 110];   // #0F766E
  const secondary = [6, 182, 212];    // #06B6D4
  const dark      = [15, 23, 42];     // #0F172A
  const gray      = [100, 116, 139];  // #64748B
  const lightGray = [241, 245, 249];  // #F1F5F9

  // ── Header banner ──────────────────────────────────────────────────────────
  doc.setFillColor(...primary);
  doc.rect(0, 0, W, 28, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Smart Learning Planner", 14, 12);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Study Progress Report", 14, 20);

  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`, W - 14, 20, { align: "right" });

  // ── Student info ───────────────────────────────────────────────────────────
  let y = 36;
  doc.setTextColor(...dark);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Student Information", 14, y);

  y += 6;
  doc.setFillColor(...lightGray);
  doc.roundedRect(14, y, W - 28, 22, 2, 2, "F");

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...gray);

  const col1x = 20, col2x = 80, col3x = 140;
  doc.text("Student", col1x, y + 7);
  doc.text("Subject", col2x, y + 7);
  doc.text("Level", col3x, y + 7);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...dark);
  doc.setFontSize(10);
  doc.text(username || "Student", col1x, y + 14);
  doc.text(subject || "—", col2x, y + 14);
  doc.text(level || "—", col3x, y + 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...gray);
  doc.text(`${days} days`, col1x, y + 20);
  doc.text(`${hours}h/day`, col2x, y + 20);

  // ── Summary stats ──────────────────────────────────────────────────────────
  y += 30;
  const totalTopics    = plan.reduce((s, d) => s + d.topics.length, 0);
  const completedCount = plan.reduce((s, d) => s + d.topics.filter(t => t.completed).length, 0);
  const verifiedCount  = plan.reduce((s, d) => s + d.topics.filter(t => t.verified).length, 0);
  const completionPct  = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;
  const verifyPct      = completedCount > 0 ? Math.round((verifiedCount / completedCount) * 100) : 0;

  doc.setTextColor(...dark);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Progress Summary", 14, y);

  y += 5;
  const stats = [
    { label: "Total Topics",   value: String(totalTopics) },
    { label: "Completed",      value: `${completedCount} (${completionPct}%)` },
    { label: "Quiz Verified",  value: `${verifiedCount} (${verifyPct}%)` },
    { label: "Days Studied",   value: String(dailyScores.length) },
  ];

  const boxW = (W - 28 - 9) / 4;
  stats.forEach((s, i) => {
    const bx = 14 + i * (boxW + 3);
    doc.setFillColor(...lightGray);
    doc.roundedRect(bx, y, boxW, 18, 2, 2, "F");
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primary);
    doc.text(s.value, bx + boxW / 2, y + 10, { align: "center" });
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...gray);
    doc.text(s.label, bx + boxW / 2, y + 16, { align: "center" });
  });

  // ── Day-by-day plan table ──────────────────────────────────────────────────
  y += 26;
  doc.setTextColor(...dark);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Study Plan & Quiz Results", 14, y);
  y += 4;

  const tableRows = [];
  plan.forEach(day => {
    day.topics.forEach(topic => {
      const status   = topic.completed ? (topic.verified ? "Verified" : "Completed") : "Pending";
      const quizStr  = topic.quizScore != null
        ? `${Math.round(topic.quizScore * 100)}%`
        : topic.completed ? "Skipped" : "—";
      tableRows.push([
        `Day ${day.day}`,
        topic.name,
        `${topic.hours}h`,
        status,
        quizStr,
      ]);
    });
  });

  autoTable(doc, {
    startY: y,
    head: [["Day", "Topic", "Hours", "Status", "Quiz Score"]],
    body: tableRows,
    styles: { fontSize: 8.5, cellPadding: 3, textColor: dark },
    headStyles: {
      fillColor: primary,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: 16, halign: "center" },
      1: { cellWidth: "auto" },
      2: { cellWidth: 16, halign: "center" },
      3: { cellWidth: 26, halign: "center" },
      4: { cellWidth: 22, halign: "center" },
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    didParseCell(data) {
      if (data.column.index === 3 && data.section === "body") {
        const val = data.cell.raw;
        if (val === "Verified")  data.cell.styles.textColor = [6, 95, 70];
        if (val === "Completed") data.cell.styles.textColor = [146, 64, 14];
        if (val === "Pending")   data.cell.styles.textColor = [153, 27, 27];
      }
    },
    margin: { left: 14, right: 14 },
  });

  // ── Daily scores table ─────────────────────────────────────────────────────
  if (dailyScores.length > 0) {
    const finalY = (doc.lastAutoTable?.finalY || y) + 10;

    // Check if we need a new page
    if (finalY > 240) doc.addPage();
    const scoreY = finalY > 240 ? 20 : finalY;

    doc.setTextColor(...dark);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Daily Study Scores (LSTM Input)", 14, scoreY);

    autoTable(doc, {
      startY: scoreY + 4,
      head: [["Date", "Score", "Performance"]],
      body: dailyScores.slice(-14).map(s => [
        s.date,
        `${Math.round(s.score * 100)}%`,
        s.score >= 0.7 ? "On Track" : s.score >= 0.4 ? "At Risk" : "Needs Attention",
      ]),
      styles: { fontSize: 8.5, cellPadding: 3, textColor: dark },
      headStyles: { fillColor: secondary, textColor: [255, 255, 255], fontStyle: "bold", fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 25, halign: "center" },
        2: { cellWidth: 40, halign: "center" },
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      didParseCell(data) {
        if (data.column.index === 2 && data.section === "body") {
          const val = data.cell.raw;
          if (val === "On Track")        data.cell.styles.textColor = [6, 95, 70];
          if (val === "At Risk")         data.cell.styles.textColor = [146, 64, 14];
          if (val === "Needs Attention") data.cell.styles.textColor = [153, 27, 27];
        }
      },
      margin: { left: 14, right: 14 },
    });
  }

  // ── Footer ─────────────────────────────────────────────────────────────────
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFillColor(...lightGray);
    doc.rect(0, doc.internal.pageSize.getHeight() - 10, W, 10, "F");
    doc.setFontSize(7.5);
    doc.setTextColor(...gray);
    doc.text("Smart Learning Planner — AI-Powered Study Platform", 14, doc.internal.pageSize.getHeight() - 3.5);
    doc.text(`Page ${i} of ${pageCount}`, W - 14, doc.internal.pageSize.getHeight() - 3.5, { align: "right" });
  }

  // ── Save ───────────────────────────────────────────────────────────────────
  const filename = `SLP_${(subject || "plan").replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(filename);
}
