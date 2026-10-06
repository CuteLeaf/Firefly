import os
import sys
import re
from pathlib import Path
from datetime import datetime
import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import tkinter.font as tkfont

# ==================== 1. Windows 高清 DPI 缩放适配 ====================
try:
    import ctypes
    ctypes.windll.shcore.SetProcessDpiAwareness(2)
except Exception:
    try:
        ctypes.windll.user32.SetProcessDPIAware()
    except Exception:
        pass

# ==================== 2. 基础路径与配色系统 ====================
CURRENT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = CURRENT_DIR.parent
OUTPUT_DIR = CURRENT_DIR / "codes_pack"

# 调色盘：白色 + 陶土红 + 橙色
COLOR_BG = "#FAF7F5"            # 柔和暖白底色
COLOR_CARD = "#FFFFFF"          # 纯白卡片底色
COLOR_BORDER = "#EDE5E1"        # 卡片极细边框
COLOR_TERRACOTTA = "#C04A2A"    # 陶土红 (主色)
COLOR_TERRA_HOVER = "#A63D20"   # 陶土红悬浮深色
COLOR_TERRA_LIGHT = "#FBEBE6"   # 陶土红浅色高亮
COLOR_ORANGE = "#E87A24"        # 暖橙色 (辅色/强调)
COLOR_ORANGE_HOVER = "#D4691B"  # 暖橙悬浮色
COLOR_TEXT_MAIN = "#2D2321"     # 陶土深褐文字
COLOR_TEXT_MUTED = "#756A66"    # 次要说明文字

IGNORE_DIRS = {
    ".git", "node_modules", "dist", "build", "__pycache__",
    ".venv", "venv", ".idea", ".vscode", "target", "codes_pack", ".next"
}

LANG_MAP = {
    ".py": "python", ".js": "javascript", ".ts": "typescript",
    ".tsx": "tsx", ".jsx": "jsx", ".vue": "vue", ".html": "html",
    ".css": "css", ".scss": "scss", ".go": "go", ".java": "java",
    ".c": "c", ".cpp": "cpp", ".rs": "rust", ".sql": "sql",
    ".sh": "bash", ".json": "json", ".yaml": "yaml", ".yml": "yaml",
    ".md": "markdown", ".xml": "xml", ".toml": "toml"
}

# ==================== 3. 现代化圆角 Canvas 控件 ====================
class RoundedButton(tk.Canvas):
    """自绘制现代圆角按钮，支持悬浮态与边框切换"""
    def __init__(self, parent, text, command=None, width=120, height=34,
                 radius=10, bg_color=COLOR_TERRACOTTA, hover_color=COLOR_TERRA_HOVER,
                 fg_color="#FFFFFF", outline_color=None, font=("Microsoft YaHei UI", 9, "bold"), **kwargs):
        super().__init__(parent, width=width, height=height, bg=parent["bg"],
                         highlightthickness=0, **kwargs)
        self.command = command
        self.radius = radius
        self.bg_color = bg_color
        self.hover_color = hover_color
        self.fg_color = fg_color
        self.outline_color = outline_color
        self.text = text
        self.font = font
        self.w = width
        self.h = height

        self.bind("<Enter>", lambda e: self.draw(self.hover_color))
        self.bind("<Leave>", lambda e: self.draw(self.bg_color))
        self.bind("<Button-1>", lambda e: self.command() if self.command else None)
        self.config(cursor="hand2")
        self.draw(self.bg_color)

    def draw(self, fill):
        self.delete("all")
        r = self.radius
        w, h = self.w, self.h
        
        # 绘制轮廓/填充
        if self.outline_color and self.outline_color != fill:
            self._render_rounded_rect(0, 0, w, h, r, self.outline_color)
            self._render_rounded_rect(1.5, 1.5, w - 1.5, h - 1.5, max(1, r - 1.5), fill)
        else:
            self._render_rounded_rect(0, 0, w, h, r, fill)

        self.create_text(w / 2, h / 2, text=self.text, fill=self.fg_color, font=self.font)

    def _render_rounded_rect(self, x1, y1, x2, y2, r, fill):
        d = 2 * r
        self.create_arc(x1, y1, x1 + d, y1 + d, start=90, extent=90, fill=fill, outline=fill)
        self.create_arc(x2 - d, y1, x2, y1 + d, start=0, extent=90, fill=fill, outline=fill)
        self.create_arc(x1, y2 - d, x1 + d, y2, start=180, extent=90, fill=fill, outline=fill)
        self.create_arc(x2 - d, y2 - d, x2, y2, start=270, extent=90, fill=fill, outline=fill)
        self.create_rectangle(x1 + r, y1, x2 - r, y2, fill=fill, outline=fill)
        self.create_rectangle(x1, y1 + r, x2, y2 - r, fill=fill, outline=fill)

class RoundedPill(tk.Canvas):
    """状态/统计胶囊徽章"""
    def __init__(self, parent, text="", bg_color=COLOR_TERRACOTTA, fg_color="#FFFFFF",
                 outline_color=None, font=("Microsoft YaHei UI", 9, "bold"), radius=10, **kwargs):
        super().__init__(parent, bg=parent["bg"], highlightthickness=0, **kwargs)
        self.bg_color = bg_color
        self.fg_color = fg_color
        self.outline_color = outline_color
        self.font = font
        self.radius = radius
        self.render(text)

    def render(self, text):
        self.delete("all")
        f = tkfont.Font(font=self.font)
        tw = f.measure(text)
        w = max(60, tw + 20)
        h = 26
        self.config(width=w, height=h)
        
        r = self.radius
        fill = self.bg_color
        outline = self.outline_color or fill

        if self.outline_color and self.outline_color != fill:
            self._render_rounded_rect(0, 0, w, h, r, outline)
            self._render_rounded_rect(1, 1, w - 1, h - 1, r - 1, fill)
        else:
            self._render_rounded_rect(0, 0, w, h, r, fill)

        self.create_text(w / 2, h / 2, text=text, fill=self.fg_color, font=self.font)

    def _render_rounded_rect(self, x1, y1, x2, y2, r, fill):
        d = 2 * r
        self.create_arc(x1, y1, x1 + d, y1 + d, start=90, extent=90, fill=fill, outline=fill)
        self.create_arc(x2 - d, y1, x2, y1 + d, start=0, extent=90, fill=fill, outline=fill)
        self.create_arc(x1, y2 - d, x1 + d, y2, start=180, extent=90, fill=fill, outline=fill)
        self.create_arc(x2 - d, y2 - d, x2, y2, start=270, extent=90, fill=fill, outline=fill)
        self.create_rectangle(x1 + r, y1, x2 - r, y2, fill=fill, outline=fill)
        self.create_rectangle(x1, y1 + r, x2, y2 - r, fill=fill, outline=fill)

# ==================== 4. 主程序界面 ====================
class ModernCodePacker:
    def __init__(self, root):
        self.root = root
        self.root.title("AI 代码上下文打包工具")
        self.root.geometry("880x640")
        self.root.minsize(760, 520)

        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        self.file_data = {}
        self.next_file_name = self.calculate_next_filename()

        self.setup_ui()
        self.refresh_stats()

    def calculate_next_filename(self) -> str:
        """
        规则：codes_pack_{序号}_{月-日}_{时.分}.md
        示例：codes_pack_1_10-04_14.30.md
        """
        existing_files = list(OUTPUT_DIR.glob("codes_pack_*.md"))
        max_seq = 0
        pattern = re.compile(r"^codes_pack_(\d+)")

        for f in existing_files:
            match = pattern.match(f.stem)
            if match:
                try:
                    seq = int(match.group(1))
                    if seq > max_seq:
                        max_seq = seq
                except ValueError:
                    pass

        next_seq = max_seq + 1
        now = datetime.now()
        date_str = now.strftime("%m-%d")    # 日期使用 '-'
        time_str = now.strftime("%H.%M")    # 时间精确到分使用 '.'
        return f"codes_pack_{next_seq}_{date_str}_{time_str}.md"

    def setup_ui(self):
        self.root.configure(bg=COLOR_BG)

        # ---------------- 顶部路径与输出卡片 ----------------
        top_card = tk.Frame(self.root, bg=COLOR_CARD, padx=16, pady=12, highlightthickness=1, highlightbackground=COLOR_BORDER)
        top_card.pack(fill=tk.X, padx=16, pady=(14, 8))

        # 标题栏
        header_row = tk.Frame(top_card, bg=COLOR_CARD)
        header_row.pack(fill=tk.X, pady=(0, 6))
        tk.Label(header_row, text="AI 代码打包工作台", font=("Microsoft YaHei UI", 12, "bold"), fg=COLOR_TERRACOTTA, bg=COLOR_CARD).pack(side=tk.LEFT)
        
        # 目标生成文件徽章
        self.pill_target = RoundedPill(header_row, text=f"下个归档: {self.next_file_name}", bg_color=COLOR_ORANGE, fg_color="#FFFFFF", radius=9)
        self.pill_target.pack(side=tk.RIGHT)

        # 路径展示
        r_box = tk.Frame(top_card, bg=COLOR_CARD)
        r_box.pack(fill=tk.X)
        tk.Label(r_box, text="项目根目录：", font=("Microsoft YaHei UI", 9, "bold"), fg=COLOR_TEXT_MUTED, bg=COLOR_CARD).pack(side=tk.LEFT)
        tk.Label(r_box, text=str(PROJECT_ROOT), font=("Consolas", 9), fg=COLOR_TEXT_MAIN, bg=COLOR_CARD).pack(side=tk.LEFT)

        # ---------------- 中间统计与数据表格卡片 ----------------
        center_card = tk.Frame(self.root, bg=COLOR_CARD, padx=14, pady=10, highlightthickness=1, highlightbackground=COLOR_BORDER)
        center_card.pack(fill=tk.BOTH, expand=True, padx=16, pady=6)

        # 顶部统计药丸栏
        stats_bar = tk.Frame(center_card, bg=COLOR_CARD)
        stats_bar.pack(fill=tk.X, pady=(0, 8))
        tk.Label(stats_bar, text="待整理文件列表", font=("Microsoft YaHei UI", 10, "bold"), fg=COLOR_TEXT_MAIN, bg=COLOR_CARD).pack(side=tk.LEFT)

        # 统计药丸徽章（右侧）
        self.pill_tokens = RoundedPill(stats_bar, text="Tokens: 0", bg_color=COLOR_ORANGE, fg_color="#FFFFFF", radius=8)
        self.pill_tokens.pack(side=tk.RIGHT, padx=(4, 0))
        self.pill_lines = RoundedPill(stats_bar, text="行数: 0", bg_color=COLOR_TERRACOTTA, fg_color="#FFFFFF", radius=8)
        self.pill_lines.pack(side=tk.RIGHT, padx=(4, 0))
        self.pill_count = RoundedPill(stats_bar, text="文件: 0", bg_color=COLOR_TERRACOTTA, fg_color="#FFFFFF", radius=8)
        self.pill_count.pack(side=tk.RIGHT, padx=(4, 0))

        # 表格样式定制
        style = ttk.Style()
        style.theme_use("clam")
        style.configure("Treeview.Heading", background=COLOR_TERRACOTTA, foreground="#FFFFFF",
                        font=("Microsoft YaHei UI", 9, "bold"), relief="flat")
        style.map("Treeview.Heading", background=[('active', COLOR_TERRA_HOVER)])
        style.configure("Treeview", rowheight=28, background=COLOR_CARD, fieldbackground=COLOR_CARD,
                        foreground=COLOR_TEXT_MAIN, font=("Consolas", 9))
        style.map("Treeview", background=[('selected', COLOR_TERRA_LIGHT)], foreground=[('selected', COLOR_TERRACOTTA)])

        cols = ("name", "rel_path", "lines", "size")
        self.tree = ttk.Treeview(center_card, columns=cols, show="headings", selectmode="extended")
        self.tree.heading("name", text="文件名")
        self.tree.heading("rel_path", text="相对项目位置")
        self.tree.heading("lines", text="行数")
        self.tree.heading("size", text="大小")

        self.tree.column("name", width=170, anchor="w")
        self.tree.column("rel_path", width=380, anchor="w")
        self.tree.column("lines", width=70, anchor="e")
        self.tree.column("size", width=80, anchor="e")

        scrollbar = ttk.Scrollbar(center_card, orient=tk.VERTICAL, command=self.tree.yview)
        self.tree.configure(yscrollcommand=scrollbar.set)
        self.tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

        # ---------------- 工具动作栏 (全圆角按钮) ----------------
        action_bar = tk.Frame(self.root, bg=COLOR_BG)
        action_bar.pack(fill=tk.X, padx=16, pady=6)

        RoundedButton(action_bar, text="➕ 添加文件", command=self.add_files,
                      bg_color=COLOR_ORANGE, hover_color=COLOR_ORANGE_HOVER, width=105, radius=10).pack(side=tk.LEFT, padx=(0, 8))
        RoundedButton(action_bar, text="📁 扫描文件夹", command=self.add_directory,
                      bg_color=COLOR_ORANGE, hover_color=COLOR_ORANGE_HOVER, width=115, radius=10).pack(side=tk.LEFT, padx=(0, 8))
        RoundedButton(action_bar, text="🗑️ 移除选中", command=self.remove_selected,
                      bg_color=COLOR_CARD, hover_color=COLOR_TERRA_LIGHT, fg_color=COLOR_TERRACOTTA,
                      outline_color=COLOR_TERRACOTTA, width=105, radius=10).pack(side=tk.LEFT, padx=(0, 8))
        RoundedButton(action_bar, text="清空列表", command=self.clear_all,
                      bg_color=COLOR_CARD, hover_color=COLOR_TERRA_LIGHT, fg_color=COLOR_TEXT_MUTED,
                      outline_color=COLOR_BORDER, width=90, radius=10).pack(side=tk.LEFT, padx=(0, 8))
        RoundedButton(action_bar, text="📂 codes_pack 目录", command=self.open_output_dir,
                      bg_color=COLOR_CARD, hover_color="#FFF6EF", fg_color=COLOR_ORANGE,
                      outline_color=COLOR_ORANGE, width=145, radius=10).pack(side=tk.RIGHT)

        # ---------------- 底部生成卡片 ----------------
        bottom_card = tk.Frame(self.root, bg=COLOR_CARD, padx=16, pady=12, highlightthickness=1, highlightbackground=COLOR_BORDER)
        bottom_card.pack(fill=tk.X, padx=16, pady=(6, 14))

        self.lbl_status = tk.Label(bottom_card, text="准备就绪", font=("Microsoft YaHei UI", 9), fg=COLOR_TEXT_MUTED, bg=COLOR_CARD)
        self.lbl_status.pack(side=tk.LEFT)

        RoundedButton(bottom_card, text="🚀 打包生成并自动复制", command=self.generate_pack,
                      bg_color=COLOR_TERRACOTTA, hover_color=COLOR_TERRA_HOVER, width=200, height=38,
                      radius=12, font=("Microsoft YaHei UI", 10, "bold")).pack(side=tk.RIGHT)

    # ==================== 5. 交互与打包逻辑 ====================
    def add_files(self):
        files = filedialog.askopenfilenames(
            title="选择代码文件 (支持在不同目录下多次添加)",
            initialdir=str(PROJECT_ROOT)
        )
        if files:
            for f in files:
                self._insert_file(Path(f).resolve())
            self.refresh_stats()

    def add_directory(self):
        target_dir = filedialog.askdirectory(
            title="选择需要递归扫描的代码目录",
            initialdir=str(PROJECT_ROOT)
        )
        if not target_dir:
            return

        added_num = 0
        for root, dirs, files in os.walk(target_dir):
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
            for file in files:
                f_path = Path(root) / file
                if f_path.suffix.lower() in LANG_MAP:
                    if self._insert_file(f_path.resolve()):
                        added_num += 1

        self.refresh_stats()
        self.lbl_status.config(text=f"从目录递归加入 {added_num} 个代码文件", fg=COLOR_ORANGE)

    def _insert_file(self, p: Path) -> bool:
        if p in self.file_data or not p.is_file():
            return False

        try:
            rel = p.relative_to(PROJECT_ROOT).as_posix()
        except ValueError:
            rel = str(p)

        try:
            content = p.read_text(encoding="utf-8", errors="ignore")
            lines = len(content.splitlines())
            size_kb = f"{p.stat().st_size / 1024:.1f} KB"
            char_count = len(content)
        except Exception:
            lines, size_kb, char_count = 0, "0 KB", 0

        self.file_data[p] = {
            "rel_path": rel,
            "lines": lines,
            "size": size_kb,
            "chars": char_count
        }
        self.tree.insert("", tk.END, iid=str(p), values=(p.name, rel, lines, size_kb))
        return True

    def remove_selected(self):
        selected_items = self.tree.selection()
        for item in selected_items:
            path_key = Path(item)
            if path_key in self.file_data:
                del self.file_data[path_key]
            self.tree.delete(item)
        self.refresh_stats()

    def clear_all(self):
        self.tree.delete(*self.tree.get_children())
        self.file_data.clear()
        self.refresh_stats()

    def refresh_stats(self):
        total_files = len(self.file_data)
        total_lines = sum(d["lines"] for d in self.file_data.values())
        total_chars = sum(d["chars"] for d in self.file_data.values())
        est_tokens = int(total_chars / 3.2)

        # 实时刷新圆角胶囊
        self.pill_count.render(f"文件: {total_files}")
        self.pill_lines.render(f"行数: {total_lines:,}")
        self.pill_tokens.render(f"Tokens: ~{est_tokens:,}")

    def open_output_dir(self):
        if OUTPUT_DIR.exists():
            os.startfile(OUTPUT_DIR)

    def generate_pack(self):
        if not self.file_data:
            messagebox.showwarning("提示", "当前列表为空，请先添加代码文件！")
            return

        self.next_file_name = self.calculate_next_filename()
        target_path = OUTPUT_DIR / self.next_file_name

        try:
            parts = []
            parts.append("# 项目代码上下文集合\n\n")
            parts.append(f"- **打包时间**：{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            parts.append(f"- **项目根目录**：`{PROJECT_ROOT.as_posix()}`\n\n")

            parts.append("## 已选文件列表概览\n")
            for p, meta in self.file_data.items():
                parts.append(f"- `{meta['rel_path']}` ({meta['lines']} 行, {meta['size']})\n")
            parts.append("\n---\n\n## 详细代码内容\n\n")

            for idx, (p, meta) in enumerate(self.file_data.items(), 1):
                lang = LANG_MAP.get(p.suffix.lower(), "")
                parts.append(f"### [{idx}] `{p.name}`\n")
                parts.append(f"- **文件位置 (相对)**：`{meta['rel_path']}`\n")
                parts.append(f"- **绝对物理路径**：`{p.as_posix()}`\n\n")
                parts.append(f"```{lang}\n")
                try:
                    code_str = p.read_text(encoding="utf-8", errors="ignore")
                    parts.append(code_str.rstrip("\n"))
                except Exception as read_err:
                    parts.append(f"// 读取异常: {read_err}")
                parts.append("\n```\n\n")

            full_content = "".join(parts)
            target_path.write_text(full_content, encoding="utf-8")

            # 写入系统剪贴板
            self.root.clipboard_clear()
            self.root.clipboard_append(full_content)

            self.lbl_status.config(text=f"已保存: {target_path.name} (已复制)", fg=COLOR_TERRACOTTA)

            # 重新计算并刷新下一个归档徽章
            self.next_file_name = self.calculate_next_filename()
            self.pill_target.render(f"下个归档: {self.next_file_name}")

            resp = messagebox.askyesno(
                "打包成功",
                f"文件已保存至：\n{target_path.name}\n\n"
                f"✔ 代码上下文已全选复制到剪贴板，可直接发给 AI\n\n"
                f"是否立即在 Windows 资源管理器中定位该文件？"
            )
            if resp:
                os.system(f'explorer /select,"{target_path}"')

        except Exception as e:
            messagebox.showerror("生成失败", f"打包时出错：{e}")

if __name__ == "__main__":
    root = tk.Tk()
    app = ModernCodePacker(root)
    root.mainloop()