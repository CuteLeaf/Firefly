# 项目代码上下文集合

- **打包时间**：2026-10-06 23:21:31
- **项目根目录**：`C:/Users/raymond/Desktop/raymond_blog`

## 已选文件列表概览
- `C:\Users\raymond\Desktop\rowan\app\impossible-list\page.tsx` (1474 行, 65.7 KB)
- `C:\Users\raymond\Desktop\rowan\app\deadline\page.tsx` (1782 行, 76.7 KB)

---

## 详细代码内容

### [1] `page.tsx`
- **文件位置 (相对)**：`C:\Users\raymond\Desktop\rowan\app\impossible-list\page.tsx`
- **绝对物理路径**：`C:/Users/raymond/Desktop/rowan/app/impossible-list/page.tsx`

```tsx
'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'

/**
 * ==============================================================================
 * 🍎 THE IMPOSSIBLE LIST - APPLE LIGHT SPECIFICATION
 * ==============================================================================
 * - Search: Real-time keyword filter across all milestones & themes
 * - Zero In On: Minimalist unboxed vertical list (No card/panel clutter)
 * - Items: Clean vertical stack with NO divider lines
 * - Settings: Minimalist borderless button
 * - Evolution Flow: New target leads ← Historical milestone follows
 * ==============================================================================
 */

const STORAGE_KEY = 'site_impossible_list_v9'

export interface ImpossibleItem {
  id: string
  title: string
  completed: boolean
  completedDate?: string
  progress?: string
  linkText?: string
  linkUrl?: string
  nextItemId?: string
  parentItemId?: string
}

export interface ImpossibleCategory {
  id: string
  name: string
  items: ImpossibleItem[]
}

function formatAppleDate(date: Date = new Date()): string {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]
  const d = date.getDate()
  const m = months[date.getMonth()]
  const y = date.getFullYear()

  let suffix = 'th'
  if (d % 10 === 1 && d !== 11) suffix = 'st'
  else if (d % 10 === 2 && d !== 12) suffix = 'nd'
  else if (d % 10 === 3 && d !== 13) suffix = 'rd'

  return `${m} ${d}${suffix}, ${y}`
}

const DEFAULT_CATEGORIES: ImpossibleCategory[] = [
  {
    id: 'cat-travel',
    name: 'Travel',
    items: [
      { id: 't-1', title: 'Visit Every Continent', completed: true, completedDate: 'Jan 20th, 2017' },
      { id: 't-2', title: 'Go Swimming in Every Ocean', completed: false },
      { id: 't-3', title: 'Travel For 1 Year Straight', completed: true, completedDate: 'Jun 30th, 2017' },
      { id: 't-4', title: 'Get a 2nd U.S. Passport', completed: false },
      { id: 't-5', title: 'Obtain dual citizenship with another country', completed: false },
      { id: 't-6', title: 'Become an Estonian E-citizen', completed: true, completedDate: 'Aug 8th, 2016' },
      { id: 't-7', title: 'Own a small flat in 4 different countries.', completed: false },
      { id: 't-8', title: 'Live on the beach in some tropical country for 3 months.', completed: false },
      { id: 't-9', title: 'Do A Cross Country Road Trip And Make a Film About It', completed: false },
      { id: 't-10', title: 'Do A Round-The-World Trip And Make A Film About It', completed: false },
      { id: 't-11', title: 'Visit All 50 States', completed: false, progress: '49/50' },
      { id: 't-12', title: 'Visit 20 Countries', completed: true, completedDate: 'Mar 10th, 2018', nextItemId: 't-13' },
      { id: 't-13', title: 'Visit 50 Countries', completed: false, parentItemId: 't-12' },
      { id: 't-14', title: 'Visit 100 Countries', completed: false },
      { id: 't-15', title: 'Visit 150 Countries', completed: false },
      { id: 't-16', title: 'Visit all the Countries', completed: false, progress: '47 total' },
      { id: 't-17', title: 'Start Impossible Island', completed: false, linkText: 'Link', linkUrl: 'https://impossiblehq.com' },
    ],
  },
  {
    id: 'cat-minimalism',
    name: 'Minimalism',
    items: [
      { id: 'm-1', title: 'Go without internet for a month', completed: true, completedDate: 'Jul 31st, 2009' },
      { id: 'm-2', title: 'Go without a car for a month', completed: true, completedDate: 'Feb 29th, 2012' },
      { id: 'm-3', title: 'Count & document all my crap', completed: true, completedDate: 'Feb 28th, 2014' },
      { id: 'm-4', title: 'Own less than 300 things', completed: true, completedDate: 'May 2nd, 2014' },
      { id: 'm-5', title: 'Create a "Getaway" Backpack', completed: false, linkText: 'Link', linkUrl: '#' },
    ],
  },
  {
    id: 'cat-adrenaline',
    name: 'Adrenaline Rushes',
    items: [
      { id: 'a-1', title: 'Go Skydiving', completed: true, completedDate: 'May 1st, 2011' },
      { id: 'a-2', title: 'Go Bungee Jumping', completed: true, completedDate: 'Jun 6th, 2011' },
      { id: 'a-3', title: 'Go Paragliding', completed: true, completedDate: 'May 1st, 2012' },
      { id: 'a-4', title: 'Go Parasailing', completed: true, completedDate: 'Aug 1st, 2009' },
      { id: 'a-5', title: 'Learn to Kitesurf', completed: true, completedDate: 'May 14th, 2012', nextItemId: 'a-6' },
      { id: 'a-6', title: 'Kitesurf for a month', completed: false, parentItemId: 'a-5' },
      { id: 'a-7', title: 'Learn to Surf', completed: false },
      { id: 'a-8', title: 'Bike Across America', completed: false },
      { id: 'a-9', title: 'Get PADI Certified & go scuba diving', completed: false },
      { id: 'a-10', title: 'Climb a Volcano', completed: true, completedDate: 'Jan 7th, 2004' },
      { id: 'a-11', title: 'Learn To Freedive', completed: false },
      { id: 'a-12', title: 'Go Zorbing', completed: true, completedDate: 'Sep 1st, 2013' },
      { id: 'a-13', title: 'Go Indoor Skydiving', completed: true, completedDate: 'Sep 1st, 2013' },
      { id: 'a-14', title: 'Walk With Wolves (and get kissed by one)', completed: true, completedDate: 'Sep 1st, 2013' },
      { id: 'a-15', title: 'Fly A Rocketman Water Jet Lev Fly Board', completed: true, completedDate: 'Aug 19th, 2013' },
      { id: 'a-16', title: 'Fly A Flyboard Water Hoverboard', completed: true, completedDate: 'Aug 20th, 2013' },
    ],
  },
  {
    id: 'cat-misc',
    name: 'Misc.',
    items: [
      { id: 'mi-1', title: 'Be an Extra in a Movie', completed: true, completedDate: 'Nov 12th, 2010' },
      { id: 'mi-2', title: 'Do Adventure Roulette', completed: true, completedDate: 'Aug 30th, 2013' },
      { id: 'mi-3', title: 'Get something named after me', completed: false },
    ],
  },
  {
    id: 'cat-events',
    name: 'Events to Attend',
    items: [
      { id: 'e-1', title: 'Visit Burning Man And Document It', completed: false },
      { id: 'e-2', title: 'Participate in Tomatina', completed: false },
      { id: 'e-3', title: 'Running of the Bulls', completed: false },
      { id: 'e-4', title: 'See The Northern Lights & Make A Time Lapse Film Of It', completed: false },
      { id: 'e-5', title: 'Coachella', completed: false },
      { id: 'e-6', title: 'Bonnaroo', completed: true, completedDate: 'Jun 1st, 2013' },
      { id: 'e-7', title: 'SXSW', completed: true, completedDate: 'May 31st, 2012' },
      { id: 'e-8', title: 'Lollapalooza', completed: false },
      { id: 'e-9', title: 'Mardi Gras', completed: false },
    ],
  },
]

const DEFAULT_ZERO_IN_ON = ['t-13', 'a-6', 't-2']

export default function ImpossibleListPage() {
  const [categories, setCategories] = useState<ImpossibleCategory[]>([])
  const [zeroInOnIds, setZeroInOnIds] = useState<string[]>([])
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [mounted, setMounted] = useState(false)
  const [animatingItemId, setAnimatingItemId] = useState<string | null>(null)

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    catId: string
    itemId: string
  } | null>(null)

  // Modals & Popovers
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<ImpossibleCategory | null>(null)
  const [isZeroInOnModalOpen, setIsZeroInOnModalOpen] = useState(false)
  const [editingItemData, setEditingItemData] = useState<{
    catId: string
    item: ImpossibleItem
  } | null>(null)

  const [nextStageAnchor, setNextStageAnchor] = useState<{
    catId: string
    parentItemId: string
    x: number
    y: number
  } | null>(null)

  // Drag and Drop States
  const [draggedCatIndex, setDraggedCatIndex] = useState<number | null>(null)
  const [dragOverCatIndex, setDragOverCatIndex] = useState<number | null>(null)

  // Form Fields
  const [nextStageTitle, setNextStageTitle] = useState('')
  const [nextStageLinkText, setNextStageLinkText] = useState('')
  const [nextStageLinkUrl, setNextStageLinkUrl] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  const appleFontFamily =
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif'

  useEffect(() => {
    setMounted(true)
    const local = localStorage.getItem(STORAGE_KEY)
    if (local) {
      try {
        const parsed = JSON.parse(local)
        if (parsed.categories && parsed.categories.length > 0) {
          setCategories(parsed.categories)
          setZeroInOnIds(parsed.zeroInOnIds || [])
          return
        }
      } catch {
        // Fallback
      }
    }
    setCategories(DEFAULT_CATEGORIES)
    setZeroInOnIds(DEFAULT_ZERO_IN_ON)
  }, [])

  useEffect(() => {
    const handleClose = () => setContextMenu(null)
    window.addEventListener('click', handleClose)
    window.addEventListener('scroll', handleClose)
    return () => {
      window.removeEventListener('click', handleClose)
      window.removeEventListener('scroll', handleClose)
    }
  }, [])

  const persistData = (newCategories: ImpossibleCategory[], newZeroIds: string[] = zeroInOnIds) => {
    setCategories(newCategories)
    setZeroInOnIds(newZeroIds)
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ categories: newCategories, zeroInOnIds: newZeroIds })
    )
  }

  // Backup & Restore
  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ categories, zeroInOnIds }, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `impossible_list_${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target?.result as string)
        if (Array.isArray(data.categories) && data.categories.length > 0) {
          persistData(data.categories, data.zeroInOnIds || [])
          alert('Data restored successfully!')
        }
      } catch {
        alert('Invalid JSON backup file format.')
      }
    }
    reader.readAsText(file)
  }

  const handleResetDefaults = () => {
    if (confirm('Restore defaults? Current custom targets will be replaced.')) {
      persistData(DEFAULT_CATEGORIES, DEFAULT_ZERO_IN_ON)
      setActiveCategoryId('all')
      setSearchQuery('')
    }
  }

  // Mark Completed / Incomplete
  const toggleItemCompletion = (catId: string, itemId: string, targetState?: boolean) => {
    const updated = categories.map((cat) => {
      if (cat.id !== catId) return cat
      return {
        ...cat,
        items: cat.items.map((item) => {
          if (item.id !== itemId) return item
          const nextState = targetState !== undefined ? targetState : !item.completed
          if (nextState) {
            setAnimatingItemId(item.id)
            setTimeout(() => setAnimatingItemId(null), 900)
          }
          return {
            ...item,
            completed: nextState,
            completedDate: nextState ? (item.completedDate || formatAppleDate()) : undefined,
          }
        }),
      }
    })
    persistData(updated)
    setContextMenu(null)
  }

  // Save Next Stage
  const handleSaveNextStage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nextStageAnchor || !nextStageTitle.trim()) return

    const newId = `evol-${Date.now()}`
    const newItem: ImpossibleItem = {
      id: newId,
      title: nextStageTitle.trim(),
      completed: false,
      linkText: nextStageLinkText.trim() || undefined,
      linkUrl: nextStageLinkUrl.trim() || undefined,
      parentItemId: nextStageAnchor.parentItemId,
    }

    const updated = categories.map((cat) => {
      if (cat.id !== nextStageAnchor.catId) return cat
      const itemIdx = cat.items.findIndex((i) => i.id === nextStageAnchor.parentItemId)
      if (itemIdx === -1) return cat

      const newItems = [...cat.items]
      newItems[itemIdx] = {
        ...newItems[itemIdx],
        nextItemId: newId,
      }
      newItems.splice(itemIdx + 1, 0, newItem)
      return { ...cat, items: newItems }
    })

    let updatedZeroInOnIds = [...zeroInOnIds]
    if (zeroInOnIds.includes(nextStageAnchor.parentItemId)) {
      updatedZeroInOnIds = zeroInOnIds.map((id) =>
        id === nextStageAnchor.parentItemId ? newId : id
      )
    } else {
      updatedZeroInOnIds.push(newId)
    }

    persistData(updated, updatedZeroInOnIds)
    setNextStageAnchor(null)
    setNextStageTitle('')
    setNextStageLinkText('')
    setNextStageLinkUrl('')
  }

  const findItemById = (id: string) => {
    for (const cat of categories) {
      const item = cat.items.find((i) => i.id === id)
      if (item) return { item, category: cat }
    }
    return null
  }

  const stats = useMemo(() => {
    let total = 0
    let completed = 0
    categories.forEach((c) => {
      c.items.forEach((i) => {
        total++
        if (i.completed) completed++
      })
    })
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    return { total, completed, percentage }
  }, [categories])

  const zeroInOnItems = useMemo(() => {
    return zeroInOnIds
      .map((id) => findItemById(id))
      .filter((x): x is { item: ImpossibleItem; category: ImpossibleCategory } => Boolean(x))
  }, [zeroInOnIds, categories])

  // 综合分类视图 + 搜索过滤
  const displayedCategories = useMemo(() => {
    let list = activeCategoryId === 'all'
      ? categories
      : categories.filter((c) => c.id === activeCategoryId)

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      list = list
        .map((cat) => ({
          ...cat,
          items: cat.items.filter(
            (item) =>
              item.title.toLowerCase().includes(q) ||
              cat.name.toLowerCase().includes(q) ||
              (item.progress && item.progress.toLowerCase().includes(q))
          ),
        }))
        .filter((cat) => cat.items.length > 0)
    }

    return list
  }, [categories, activeCategoryId, searchQuery])

  if (!mounted) return null

  return (
    <div
      style={{ fontFamily: appleFontFamily }}
      className="antialiased pb-24 w-screen relative left-1/2 -translate-x-1/2 px-4 sm:px-8 xl:px-14 max-w-[1720px] mx-auto box-border text-neutral-900 dark:text-neutral-100"
    >
      <style>{`
        @keyframes appleStrikeThrough {
          0% { width: 0%; opacity: 0.3; }
          60% { width: 100%; opacity: 1; }
          100% { width: 100%; opacity: 0.85; }
        }
        .anim-strike {
          position: relative;
        }
        .anim-strike::after {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          height: 1.5px;
          background-color: currentColor;
          animation: appleStrikeThrough 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes applePopoverFade {
          0% { opacity: 0; transform: scale(0.96) translateY(-4px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-apple-popover {
          animation: applePopoverFade 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleImport}
      />

      {/* 1. 顶部标题栏：内置搜索框 + 无边框 Settings */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 pt-6 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-[-0.025em] text-gray-900 dark:text-gray-100">
              Impossible List
            </h1>
            <button
              onClick={() => setIsCategoryManagerOpen(true)}
              className="text-xs font-medium px-2.5 py-1 rounded-full bg-neutral-100/90 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all active:scale-95 cursor-pointer tracking-tight border-none"
              title="Manage and reorder categories"
            >
              Settings
            </button>
          </div>
<p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1.5 tracking-tight">
  <span className="block">
    You can't do a project; you can only do action steps related to it.
  </span>
  <span className="block mt-1">
    When enough of the right action steps have been taken, some situation will have been created that matches your initial picture of the outcome finished.
  </span>
</p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <div className="relative flex items-center">
            <svg
              className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search targets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-7 py-1 text-xs rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#0071e3] w-32 sm:w-44 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 text-xs cursor-pointer"
                title="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <button
            onClick={handleExport}
            title="Export all data to JSON"
            className="text-xs font-medium text-neutral-400 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors cursor-pointer px-1 py-1"
          >
            export
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Import JSON to restore data"
            className="text-xs font-medium text-neutral-400 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors cursor-pointer px-1 py-1"
          >
            import
          </button>
          <button
            onClick={handleResetDefaults}
            className="text-xs font-medium text-neutral-400 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors cursor-pointer px-1 py-1"
          >
            default
          </button>

          <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-full ml-1">
            <span className="text-[10px] font-mono font-bold tracking-tight text-neutral-500 uppercase">
              Progress
            </span>
            <span className="text-xs font-mono font-semibold text-[#0071e3]">
              {stats.completed}/{stats.total}
            </span>
            <span className="text-[10px] font-mono font-medium text-neutral-400">
              ({stats.percentage}%)
            </span>
          </div>
        </div>
      </div>

      {/* 2. 🎯 ZERO IN ON 顶置专注（无面板外框，纯粹通透的单列列表） */}
      <section className="my-5 space-y-2">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60 dark:border-neutral-800/80">
          <div className="flex items-baseline gap-2.5">
            <h2 className="text-[11px] font-mono font-bold uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">
              Zero In On
            </h2>
            <span className="text-[10px] font-mono text-neutral-400">
              · {zeroInOnItems.length} Active Targets
            </span>
          </div>
          <button
            onClick={() => setIsZeroInOnModalOpen(true)}
            className="inline-flex items-center justify-center rounded-full bg-[#0071e3] px-3.5 py-1 text-xs font-medium text-white shadow-xs hover:bg-[#0077ed] active:scale-95 transition-all cursor-pointer"
          >
            + Add
          </button>
        </div>

        {zeroInOnItems.length === 0 ? (
          <div className="text-xs font-medium text-neutral-400 tracking-tight italic py-3 text-center">
            No active targets chosen. Click "+ Add" to focus on key milestones.
          </div>
        ) : (
          <div className="flex flex-col space-y-1">
            {zeroInOnItems.map(({ item, category }, index) => {
              const parentItem = item.parentItemId
                ? category.items.find((i) => i.id === item.parentItemId)
                : null

              return (
                <div
                  key={item.id}
                  onContextMenu={(e) => {
                    e.preventDefault()
                    setContextMenu({
                      x: e.clientX,
                      y: e.clientY,
                      catId: category.id,
                      itemId: item.id,
                    })
                  }}
                  className="group flex items-center justify-between py-2 px-1.5 rounded-lg hover:bg-neutral-100/70 dark:hover:bg-neutral-800/50 transition-colors cursor-context-menu"
                >
                  <div className="flex items-center flex-wrap gap-2.5 min-w-0 pr-3 text-[14px]">
                    <span className="font-mono text-xs font-bold text-neutral-400 shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <span
                      className={`tracking-[-0.01em] ${
                        item.completed
                          ? 'line-through text-neutral-400 dark:text-neutral-500 font-normal'
                          : 'text-neutral-900 dark:text-neutral-100 font-medium'
                      }`}
                    >
                      {item.title}
                    </span>

                    {item.completed && item.completedDate && (
                      <span className="text-[11px] font-mono font-semibold text-[#0071e3] shrink-0">
                        [{item.completedDate}]
                      </span>
                    )}

                    {parentItem && (
                      <div className="inline-flex items-center gap-1.5 shrink-0 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full text-xs">
                        <span className="text-[#ff2d55] font-bold text-xs select-none">
                          ←
                        </span>
                        <span className="line-through text-neutral-400 dark:text-neutral-500 text-[11px] font-normal tracking-tight">
                          {parentItem.title}
                        </span>
                        {parentItem.completedDate && (
                          <span className="text-[9px] font-mono font-semibold text-[#0071e3]">
                            [{parentItem.completedDate}]
                          </span>
                        )}
                      </div>
                    )}

                    {item.linkUrl && item.linkText && (
                      <a
                        href={item.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#0071e3] underline shrink-0 hover:opacity-80 tracking-tight"
                      >
                        – {item.linkText}
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 uppercase">
                      {category.name}
                    </span>
                    <button
                      onClick={() =>
                        persistData(
                          categories,
                          zeroInOnIds.filter((id) => id !== item.id)
                        )
                      }
                      className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-xs px-1 transition-opacity cursor-pointer"
                      title="Remove from Focus"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* 3. 🍎 主题分类胶囊导航栏（含「All」总览胶囊） */}
      <div className="pt-2 pb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveCategoryId('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-tight transition-all active:scale-95 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeCategoryId === 'all'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-sm'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
          >
            <span>All</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                activeCategoryId === 'all'
                  ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black font-bold'
                  : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400'
              }`}
            >
              {stats.completed}/{stats.total}
            </span>
          </button>

          {categories.map((cat) => {
            const isSelected = activeCategoryId === cat.id
            const count = cat.items.length
            const completed = cat.items.filter((i) => i.completed).length

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-tight transition-all active:scale-95 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-sm'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black font-bold'
                      : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400'
                  }`}
                >
                  {completed}/{count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 4. 🌟 清单展示区：纯粹单列纵向排列，彻底去除每一项之间的横向分割线 */}
      <div className="space-y-12 pt-2">
        {displayedCategories.map((category) => {
          const total = category.items.length
          const completed = category.items.filter((i) => i.completed).length
          const pct = total > 0 ? Math.round((completed / total) * 100) : 0

          return (
            <section key={category.id} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-3 border-b border-neutral-200/80 dark:border-neutral-800">
                <div className="flex items-baseline gap-3">
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.025em] text-neutral-900 dark:text-neutral-100">
                    {category.name}
                  </h2>
                  <span className="text-xs font-mono text-neutral-400 font-medium">
                    {completed} of {total} completed ({pct}%)
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-36 sm:w-48 h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                    <div
                      className="h-full bg-[#0071e3] rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="px-3 py-1 rounded-full text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white border border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 transition-colors cursor-pointer"
                  >
                    Edit Theme
                  </button>
                </div>
              </div>

              <div className="flex flex-col space-y-2.5">
                {category.items
                  .filter((item) => !item.parentItemId)
                  .map((rootItem) => {
                    const chain: ImpossibleItem[] = []
                    let cur: ImpossibleItem | undefined = rootItem
                    while (cur) {
                      chain.push(cur)
                      cur = category.items.find((i) => i.id === cur?.nextItemId)
                    }

                    const reversedChain = [...chain].reverse()

                    return (
                      <div
                        key={rootItem.id}
                        className="group/item flex items-start gap-3 py-1 transition-colors"
                      >
                        <span className="mt-2 shrink-0 flex items-center justify-center">
                          {reversedChain[0].completed ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3]" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600 group-hover/item:bg-[#0071e3] transition-colors" />
                          )}
                        </span>

                        <div className="inline-flex flex-wrap items-center gap-x-2 gap-y-1.5 flex-1 min-w-0 text-[14px] leading-relaxed">
                          {reversedChain.map((item, index) => {
                            const isHead = index === 0
                            const isAnimating = animatingItemId === item.id

                            return (
                              <React.Fragment key={item.id}>
                                {!isHead && (
                                  <span className="inline-flex items-center text-[#ff2d55] font-bold text-xs select-none px-0.5">
                                    ←
                                  </span>
                                )}

                                <div
                                  onContextMenu={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    setContextMenu({
                                      x: e.clientX,
                                      y: e.clientY,
                                      catId: category.id,
                                      itemId: item.id,
                                    })
                                  }}
                                  className={`group/node relative inline-flex items-center gap-1.5 px-2 py-0.5 -mx-1.5 rounded-lg transition-all cursor-context-menu select-none ${
                                    item.completed
                                      ? 'hover:bg-rose-50/70 dark:hover:bg-rose-950/20'
                                      : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                  }`}
                                >
                                  <span
                                    className={`transition-colors ${
                                      item.completed
                                        ? 'line-through text-neutral-400 dark:text-neutral-500 font-normal'
                                        : 'text-neutral-900 dark:text-neutral-100 font-medium'
                                    } ${isAnimating ? 'anim-strike font-semibold' : ''}`}
                                  >
                                    {item.title}
                                  </span>

                                  {item.progress && (
                                    <span className="text-[11px] font-mono text-neutral-400">
                                      {item.progress}
                                    </span>
                                  )}

                                  {item.completed && item.completedDate && (
                                    <span className="text-[11px] font-mono font-semibold text-[#0071e3]">
                                      [{item.completedDate}]
                                    </span>
                                  )}

                                  {item.linkUrl && item.linkText && (
                                    <span className="text-neutral-400">
                                      {' '}–{' '}
                                      <a
                                        href={item.linkUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="font-medium text-[#0071e3] underline hover:opacity-80"
                                      >
                                        {item.linkText}
                                      </a>
                                    </span>
                                  )}

                                  {item.completed && isHead && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        const rect = e.currentTarget.getBoundingClientRect()
                                        setNextStageAnchor({
                                          catId: category.id,
                                          parentItemId: item.id,
                                          x: rect.right + 10,
                                          y: rect.top - 12,
                                        })
                                      }}
                                      title="Create next stage evolution"
                                      className="opacity-0 group-hover/node:opacity-100 w-3.5 h-3.5 rounded-full bg-[#ff2d55] text-white flex items-center justify-center text-[10px] font-bold shadow-[0_0_8px_rgba(255,45,85,0.7)] hover:scale-110 active:scale-95 transition-all ml-0.5 cursor-pointer"
                                    >
                                      +
                                    </button>
                                  )}
                                </div>
                              </React.Fragment>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
              </div>
            </section>
          )
        })}

        {displayedCategories.length === 0 && (
          <div className="py-20 text-center text-neutral-400 text-sm">
            No milestones found matching "{searchQuery}".
          </div>
        )}
      </div>

      {/* =====================================================================
       * ⚡ NEXT STAGE 就地侧边轻量浮层
       * ===================================================================== */}
      {nextStageAnchor &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[99998] bg-transparent"
              onClick={() => setNextStageAnchor(null)}
            />

            <div
              className="fixed z-[99999] rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-4 shadow-2xl animate-apple-popover w-[290px] sm:w-[320px] text-neutral-900 dark:text-neutral-100"
              style={{
                left: Math.min(nextStageAnchor.x, window.innerWidth - 335),
                top: Math.min(nextStageAnchor.y, window.innerHeight - 260),
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100 dark:border-neutral-800">
                <h4 className="text-xs font-bold tracking-tight text-neutral-800 dark:text-neutral-200">
                  Next Stage
                </h4>
                <button
                  type="button"
                  onClick={() => setNextStageAnchor(null)}
                  className="text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveNextStage} className="space-y-2.5">
                <div>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="New milestone title..."
                    value={nextStageTitle}
                    onChange={(e) => setNextStageTitle(e.target.value)}
                    className="w-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#ff2d55]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Link label"
                    value={nextStageLinkText}
                    onChange={(e) => setNextStageLinkText(e.target.value)}
                    className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-2.5 py-1.5 text-[11px] text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#ff2d55]"
                  />
                  <input
                    type="text"
                    placeholder="https://..."
                    value={nextStageLinkUrl}
                    onChange={(e) => setNextStageLinkUrl(e.target.value)}
                    className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-2.5 py-1.5 text-[11px] text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#ff2d55]"
                  />
                </div>

                <div className="flex justify-end items-center gap-2 pt-1.5">
                  <button
                    type="button"
                    onClick={() => setNextStageAnchor(null)}
                    className="text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-white px-2.5 py-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#ff2d55] hover:bg-[#ff375f] text-white text-xs font-semibold px-3.5 py-1 rounded-full shadow-xs active:scale-95 transition-all"
                  >
                    Save Stage
                  </button>
                </div>
              </form>
            </div>
          </>,
          document.body
        )}

      {/* =====================================================================
       * 🖱️ 苹果风格右键菜单
       * ===================================================================== */}
      {contextMenu &&
        createPortal(
          <div
            className="fixed z-[999999] rounded-2xl bg-white/95 dark:bg-neutral-900/95 border border-neutral-200 dark:border-neutral-700 p-1.5 shadow-2xl backdrop-blur-xl animate-apple-popover flex flex-col min-w-[170px] text-xs text-neutral-900 dark:text-neutral-100"
            style={{
              left: Math.min(contextMenu.x, window.innerWidth - 180),
              top: Math.min(contextMenu.y, window.innerHeight - 170),
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const cat = categories.find((c) => c.id === contextMenu.catId)
              const item = cat?.items.find((i) => i.id === contextMenu.itemId)
              if (!item) return null
              const isZero = zeroInOnIds.includes(item.id)

              return (
                <>
                  <div className="px-2.5 py-1 text-[10px] font-mono font-semibold text-neutral-400 border-b border-neutral-100 dark:border-neutral-800 uppercase tracking-wider mb-1 truncate">
                    {item.title}
                  </div>

                  <button
                    onClick={() =>
                      toggleItemCompletion(contextMenu.catId, contextMenu.itemId, !item.completed)
                    }
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    <span>{item.completed ? 'Mark Incomplete' : 'Mark Completed'}</span>
                    <span className="text-[#0071e3] font-bold">{item.completed ? '↩' : '✓'}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (isZero) {
                        persistData(
                          categories,
                          zeroInOnIds.filter((id) => id !== item.id)
                        )
                      } else {
                        persistData(categories, [...zeroInOnIds, item.id])
                      }
                      setContextMenu(null)
                    }}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    <span>{isZero ? 'Remove Focus' : 'Add to Focus'}</span>
                    <span className="text-amber-500 font-bold">{isZero ? '★' : '☆'}</span>
                  </button>

                  <div className="h-px bg-neutral-100 dark:bg-neutral-800 my-1" />

                  <button
                    onClick={() => {
                      setEditingItemData({ catId: contextMenu.catId, item: { ...item } })
                      setContextMenu(null)
                    }}
                    className="px-2.5 py-1.5 rounded-lg text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer text-neutral-500"
                  >
                    Edit Details...
                  </button>
                </>
              )
            })()}
          </div>,
          document.body
        )}

      {/* =====================================================================
       * ⚙️ SETTINGS 弹窗：支持拖拽排序主题
       * ===================================================================== */}
      {isCategoryManagerOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/35 p-4 backdrop-blur-xs"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsCategoryManagerOpen(false)
            }}
          >
            <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-3xl p-6 text-neutral-900 dark:text-white shadow-2xl animate-apple-popover">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <div>
                  <h3 className="text-base font-bold tracking-[-0.02em]">
                    Manage Categories
                  </h3>
                  <p className="text-[11px] text-neutral-400 mt-0.5 tracking-tight">
                    Drag and drop to rearrange order
                  </p>
                </div>
                <button
                  onClick={() => setIsCategoryManagerOpen(false)}
                  className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="py-4 space-y-2 max-h-[55vh] overflow-y-auto pr-1">
                {categories.map((cat, idx) => (
                  <div
                    key={cat.id}
                    draggable
                    onDragStart={(e) => {
                      setDraggedCatIndex(idx)
                      e.dataTransfer.effectAllowed = 'move'
                    }}
                    onDragOver={(e) => {
                      e.preventDefault()
                      e.dataTransfer.dropEffect = 'move'
                      if (dragOverCatIndex !== idx) setDragOverCatIndex(idx)
                    }}
                    onDragLeave={() => {
                      if (dragOverCatIndex === idx) setDragOverCatIndex(null)
                    }}
                    onDrop={(e) => {
                      e.preventDefault()
                      if (draggedCatIndex === null || draggedCatIndex === idx) return
                      const updated = [...categories]
                      const [moved] = updated.splice(draggedCatIndex, 1)
                      updated.splice(idx, 0, moved)
                      persistData(updated)
                      setDraggedCatIndex(null)
                      setDragOverCatIndex(null)
                    }}
                    onDragEnd={() => {
                      setDraggedCatIndex(null)
                      setDragOverCatIndex(null)
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-grab active:cursor-grabbing ${
                      draggedCatIndex === idx
                        ? 'opacity-40 border-dashed border-[#0071e3] bg-neutral-100 dark:bg-neutral-800'
                        : dragOverCatIndex === idx
                        ? 'border-[#0071e3] bg-[#0071e3]/10 shadow-xs'
                        : 'bg-neutral-50 dark:bg-neutral-800/60 border-neutral-200/80 dark:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-neutral-400 text-xs select-none">⠿</span>
                      <span className="font-semibold text-xs tracking-tight">{cat.name}</span>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`Delete "${cat.name}" and all its targets?`)) {
                          const updated = categories.filter((c) => c.id !== cat.id)
                          persistData(updated)
                          if (activeCategoryId === cat.id) {
                            setActiveCategoryId('all')
                          }
                        }
                      }}
                      className="text-rose-500 hover:text-rose-700 text-xs px-2 py-0.5 rounded cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="New category name..."
                  id="new-category-input"
                  className="flex-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0071e3]"
                />
                <button
                  onClick={() => {
                    const el = document.getElementById('new-category-input') as HTMLInputElement
                    if (el && el.value.trim()) {
                      const newCat: ImpossibleCategory = {
                        id: `cat-${Date.now()}`,
                        name: el.value.trim(),
                        items: [],
                      }
                      persistData([...categories, newCat])
                      setActiveCategoryId(newCat.id)
                      el.value = ''
                    }
                  }}
                  className="bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold px-4 py-1.5 rounded-xl cursor-pointer shadow-xs"
                >
                  Add
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* =====================================================================
       * ✏️ EDIT THEME 弹窗
       * ===================================================================== */}
      {editingCategory &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/35 p-4 backdrop-blur-xs"
            onClick={(e) => {
              if (e.target === e.currentTarget) setEditingCategory(null)
            }}
          >
            <div className="relative w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-3xl p-6 text-neutral-900 dark:text-white shadow-2xl animate-apple-popover max-h-[85vh] flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    Edit Theme:
                  </h3>
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) => {
                      const updatedCat = { ...editingCategory, name: e.target.value }
                      setEditingCategory(updatedCat)
                      setCategories(categories.map((c) => (c.id === updatedCat.id ? updatedCat : c)))
                    }}
                    className="bg-neutral-100 dark:bg-neutral-800 font-bold px-2 py-0.5 rounded text-sm text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => {
                    persistData(categories)
                    setEditingCategory(null)
                  }}
                  className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-3 space-y-2 pr-1">
                {editingCategory.items.map((it) => (
                  <div
                    key={it.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <span className={it.completed ? 'line-through text-neutral-400' : 'text-neutral-800 dark:text-neutral-200 font-medium'}>
                        {it.title}
                      </span>
                      {it.completed && <span className="text-[#0071e3] text-[10px] font-mono">[{it.completedDate}]</span>}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          setEditingItemData({ catId: editingCategory.id, item: { ...it } })
                        }}
                        className="px-2 py-0.5 rounded bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          const updatedCat = {
                            ...editingCategory,
                            items: editingCategory.items.filter((x) => x.id !== it.id),
                          }
                          setEditingCategory(updatedCat)
                          persistData(categories.map((c) => (c.id === updatedCat.id ? updatedCat : c)))
                        }}
                        className="px-2 py-0.5 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
                <input
                  type="text"
                  placeholder="Add new target..."
                  id="add-item-title-input"
                  className="w-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-neutral-900 dark:text-white focus:outline-none"
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => {
                      const titleEl = document.getElementById('add-item-title-input') as HTMLInputElement
                      if (!titleEl || !titleEl.value.trim()) return
                      const newItem: ImpossibleItem = {
                        id: `item-${Date.now()}`,
                        title: titleEl.value.trim(),
                        completed: false,
                      }
                      const updatedCat = {
                        ...editingCategory,
                        items: [...editingCategory.items, newItem],
                      }
                      setEditingCategory(updatedCat)
                      persistData(categories.map((c) => (c.id === updatedCat.id ? updatedCat : c)))
                      titleEl.value = ''
                    }}
                    className="bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-xs cursor-pointer"
                  >
                    + Add to Theme
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* =====================================================================
       * 📝 EDIT ITEM DETAILS 弹窗
       * ===================================================================== */}
      {editingItemData &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/35 p-4 backdrop-blur-xs"
            onClick={(e) => {
              if (e.target === e.currentTarget) setEditingItemData(null)
            }}
          >
            <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-3xl p-6 text-neutral-900 dark:text-white shadow-2xl animate-apple-popover">
              <h3 className="text-sm font-bold pb-2.5 border-b border-neutral-100 dark:border-neutral-800 tracking-tight">
                Edit Item Details
              </h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const updated = categories.map((cat) => {
                    if (cat.id !== editingItemData.catId) return cat
                    return {
                      ...cat,
                      items: cat.items.map((i) =>
                        i.id === editingItemData.item.id ? editingItemData.item : i
                      ),
                    }
                  })
                  persistData(updated)
                  setEditingItemData(null)
                }}
                className="mt-3 space-y-3 text-xs"
              >
                <div>
                  <label className="block text-neutral-400 mb-1 tracking-tight">Title</label>
                  <input
                    type="text"
                    required
                    value={editingItemData.item.title}
                    onChange={(e) =>
                      setEditingItemData({
                        ...editingItemData,
                        item: { ...editingItemData.item, title: e.target.value },
                      })
                    }
                    className="w-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-1.5 text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    id="edit-item-completed"
                    checked={editingItemData.item.completed}
                    onChange={(e) =>
                      setEditingItemData({
                        ...editingItemData,
                        item: {
                          ...editingItemData.item,
                          completed: e.target.checked,
                          completedDate: e.target.checked
                            ? editingItemData.item.completedDate || formatAppleDate()
                            : undefined,
                        },
                      })
                    }
                    className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="edit-item-completed" className="text-neutral-700 dark:text-neutral-300 font-medium cursor-pointer">
                    Completed
                  </label>
                </div>

                {editingItemData.item.completed && (
                  <div>
                    <label className="block text-neutral-400 mb-1 tracking-tight">Completion Date</label>
                    <input
                      type="text"
                      placeholder="e.g. Jun 30th, 2017"
                      value={editingItemData.item.completedDate || ''}
                      onChange={(e) =>
                        setEditingItemData({
                          ...editingItemData,
                          item: { ...editingItemData.item, completedDate: e.target.value },
                        })
                      }
                      className="w-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-1.5 text-neutral-900 dark:text-white font-mono focus:outline-none"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-neutral-400 mb-1 tracking-tight">Link Label</label>
                    <input
                      type="text"
                      placeholder="e.g. Link"
                      value={editingItemData.item.linkText || ''}
                      onChange={(e) =>
                        setEditingItemData({
                          ...editingItemData,
                          item: { ...editingItemData.item, linkText: e.target.value },
                        })
                      }
                      className="w-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-1.5 text-neutral-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1 tracking-tight">Link URL</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={editingItemData.item.linkUrl || ''}
                      onChange={(e) =>
                        setEditingItemData({
                          ...editingItemData,
                          item: { ...editingItemData.item, linkUrl: e.target.value },
                        })
                      }
                      className="w-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-1.5 text-neutral-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setEditingItemData(null)}
                    className="px-3 py-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium rounded-full cursor-pointer shadow-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* =====================================================================
       * 🎯 ZERO IN ON FOCUS 勾选设置弹窗
       * ===================================================================== */}
      {isZeroInOnModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/35 p-4 backdrop-blur-xs"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsZeroInOnModalOpen(false)
            }}
          >
            <div className="relative w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-3xl p-6 text-neutral-900 dark:text-white shadow-2xl animate-apple-popover max-h-[85vh] flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <h3 className="text-base font-bold tracking-tight">
                  Zero In On Focus
                </h3>
                <button
                  onClick={() => setIsZeroInOnModalOpen(false)}
                  className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
                {categories.map((cat) => (
                  <div key={cat.id} className="space-y-1.5">
                    <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold">
                      {cat.name}
                    </div>
                    <div className="space-y-1">
                      {cat.items.map((it) => {
                        const isChecked = zeroInOnIds.includes(it.id)
                        return (
                          <label
                            key={it.id}
                            className={`flex items-center gap-2.5 p-2 rounded-xl text-xs cursor-pointer transition-colors ${
                              isChecked
                                ? 'bg-[#0071e3]/10 border border-[#0071e3]/30 text-neutral-900 dark:text-white font-medium'
                                : 'bg-neutral-50 dark:bg-neutral-800/40 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setZeroInOnIds([...zeroInOnIds, it.id])
                                } else {
                                  setZeroInOnIds(zeroInOnIds.filter((id) => id !== it.id))
                                }
                              }}
                              className="rounded text-blue-600 focus:ring-0"
                            />
                            <span className={it.completed ? 'line-through text-neutral-400' : ''}>
                              {it.title}
                            </span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center text-xs">
                <span className="text-neutral-400 font-mono">{zeroInOnIds.length} items highlighted</span>
                <button
                  onClick={() => {
                    persistData(categories, zeroInOnIds)
                    setIsZeroInOnModalOpen(false)
                  }}
                  className="bg-[#0071e3] hover:bg-[#0077ed] text-white px-5 py-1.5 rounded-full font-semibold shadow-xs cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
```

### [2] `page.tsx`
- **文件位置 (相对)**：`C:\Users\raymond\Desktop\rowan\app\deadline\page.tsx`
- **绝对物理路径**：`C:/Users/raymond/Desktop/rowan/app/deadline/page.tsx`

```tsx
'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'

/**
 * ==============================================================================
 * 💾 数据存储与备份机制说明 (DATA STORAGE & BACKUP SYSTEM)
 * ==============================================================================
 * 存储介质：浏览器 LocalStorage
 * 键名升级至 v7
 * ==============================================================================
 */

const STORAGE_KEY = 'site_deadlines_data_v7'

export type PriorityLevel = 'critical' | 'medium' | 'important'

interface CountdownItem {
  id: string
  category: string
  title: string
  subtitle: string
  targetDate: string // 格式: YYYY-MM-DDTHH:mm
  image: string
  badgeText?: string
  color?: string
  link?: string // 自定义跳转链接（可选）
  isPinned?: boolean // 是否置顶
  isArchived?: boolean // 是否已归档
  priority?: PriorityLevel // 重要程度: 'critical' (极度重要) | 'medium' (中等重要) | 'important' (重要)
}

// 默认预设案例
const DEFAULT_ITEMS: CountdownItem[] = [
  {
    id: '1',
    category: 'TV',
    title: 'TED LASSO',
    subtitle: 'SEASON 4 EPISODE 10 RELEASE DATE',
    targetDate: '2026-10-06T15:00',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
    color: '#0071e3',
    isPinned: true,
    priority: 'medium',
  },
  {
    id: '2',
    category: 'TV',
    title: 'HELLUVA BOSS',
    subtitle: 'SEASON 3 PREMIERE DATE',
    targetDate: '2026-10-13T12:00',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    color: '#ff375f',
    link: 'https://baidu.com',
    priority: 'important',
  },
  {
    id: '3',
    category: 'TV',
    title: 'BLEACH: THOUSAND-YEAR BLOOD WAR',
    subtitle: 'SEASON 4 EPISODE 9 RELEASE DATE',
    targetDate: '2026-10-19T23:00',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    color: '#ff9f0a',
    priority: 'medium',
  },
  {
    id: '4',
    category: 'TV',
    title: 'SOUTH PARK',
    subtitle: 'SEASON 29 EPISODE 3 RELEASE DATE',
    targetDate: '2026-10-24T22:00',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    color: '#34c759',
    priority: 'important',
  },
  {
    id: '5',
    category: 'MOVIE',
    title: 'GATTO',
    subtitle: 'OFFICIAL THEATRICAL RELEASE DATE',
    targetDate: '2026-11-05T00:00',
    image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80',
    color: '#30b0c7',
    priority: 'important',
  },
  {
    id: '6',
    category: 'GAME',
    title: 'GRAND THEFT AUTO VI (GTA 6)',
    subtitle: 'OFFICIAL WORLDWIDE RELEASE DATE',
    targetDate: '2026-11-20T00:00',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    color: '#af52de',
    priority: 'critical',
  },
  {
    id: '7',
    category: 'TEST',
    title: '考研初试',
    subtitle: '全国硕士研究生统一招生考试',
    targetDate: '2026-12-19T08:30',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
    badgeText: 'FINAL SPRINT',
    color: '#ff453a',
    isPinned: true,
    priority: 'critical',
  },
  {
    id: '8',
    category: 'MOVIE',
    title: 'AVENGERS: DOOMSDAY',
    subtitle: 'MARVEL STUDIOS PREMIERE',
    targetDate: '2026-12-25T00:00',
    image: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80',
    badgeText: 'CONFIRMED',
    color: '#34c759',
    priority: 'medium',
  },
  {
    id: '9',
    category: 'OTHER',
    title: 'THE YEAR 2027',
    subtitle: 'COUNTDOWN TO NEW YEARS DAY',
    targetDate: '2027-01-01T00:00',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    color: '#ffd60a',
    priority: 'important',
  },
  {
    id: '10',
    category: 'MOVIE',
    title: 'SONIC THE HEDGEHOG 4',
    subtitle: 'THEATRICAL RELEASE DATE',
    targetDate: '2027-03-18T00:00',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    color: '#0071e3',
    priority: 'important',
  },
  {
    id: '11',
    category: 'TV',
    title: 'STICK',
    subtitle: 'SEASON 2 PREMIERE DATE',
    targetDate: '2027-05-10T00:00',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
    color: '#ff9f0a',
    priority: 'important',
  },
  {
    id: '12',
    category: 'TV',
    title: 'SILO',
    subtitle: 'SEASON 4 PREMIERE DATE',
    targetDate: '2027-08-15T00:00',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    badgeText: 'UNCONFIRMED',
    color: '#bf5af2',
    priority: 'medium',
  },
  {
    id: '13',
    category: 'TV',
    title: 'DARLING IN THE FRANXX',
    subtitle: 'SEASON 2 RELEASE DATE',
    targetDate: '2027-09-15T00:00',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    badgeText: 'UNCONFIRMED',
    color: '#ff375f',
    priority: 'important',
  },
  {
    id: '14',
    category: 'TV',
    title: 'GAME OF THRONES: SNOW',
    subtitle: 'SEQUEL SERIES PREMIERE',
    targetDate: '2027-11-05T00:00',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    badgeText: 'UNCONFIRMED',
    color: '#5e5ce6',
    priority: 'important',
  },
  {
    id: '15',
    category: 'GAME',
    title: 'ZIBA',
    subtitle: 'PC RELEASE DATE',
    targetDate: '2028-06-01T00:00',
    image: 'https://images.unsplash.com/photo-1552824722-ddab1374e622?auto=format&fit=crop&w=800&q=80',
    badgeText: 'UNCONFIRMED',
    color: '#30b0c7',
    priority: 'important',
  },
  {
    id: 'archived-1',
    category: 'GAME',
    title: 'BLACK MYTH: WUKONG',
    subtitle: '全球同步正式发售与首发通关',
    targetDate: '2024-08-20T10:00',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    badgeText: 'LAUNCHED',
    color: '#ffffff',
    link: 'https://store.steampowered.com',
    isArchived: true,
    priority: 'critical',
  },
  {
    id: 'archived-2',
    category: 'TEST',
    title: '硕士毕业论文答辩',
    subtitle: '论文最终定稿与学位答辩委员会表决通过',
    targetDate: '2026-06-15T09:00',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    badgeText: 'PASSED',
    color: '#ffffff',
    isArchived: true,
    priority: 'critical',
  },
  {
    id: 'archived-3',
    category: 'LIFE',
    title: '城市半程马拉松',
    subtitle: '首场 21.0975km 挑战顺利完赛',
    targetDate: '2026-04-19T07:30',
    image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=800&q=80',
    badgeText: 'FINISHED',
    color: '#ffffff',
    isArchived: true,
    priority: 'medium',
  },
]

// 📅 日期格式统一：mm/dd-yyyy
function formatDateBadge(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const year = String(d.getFullYear())
  return `${month}/${day}-${year}`
}

export default function DeadlinePage() {
  const [items, setItems] = useState<CountdownItem[]>([])
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState<number>(Date.now())
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')

  // 抽屉状态与抽屉 Tab
  const [isArchiveDrawerOpen, setIsArchiveDrawerOpen] = useState(false)
  const [archiveDrawerTab, setArchiveDrawerTab] = useState<'list' | 'select'>('list')

  // 右键快捷菜单状态
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    itemId: string
  } | null>(null)

  const [highlightedCardId, setHighlightedCardId] = useState<string | null>(null)
  const highlightTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // 弹窗表单状态
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Partial<CountdownItem>>({
    category: 'TARGET',
    title: '',
    subtitle: '',
    targetDate: '',
    image: '',
    badgeText: '',
    link: '',
    isPinned: false,
    priority: 'important',
  })

  const appleFontFamily =
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif'

  useEffect(() => {
    setMounted(true)
    const localData = localStorage.getItem(STORAGE_KEY)
    if (localData) {
      try {
        const parsed = JSON.parse(localData)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed)
        } else {
          setItems(DEFAULT_ITEMS)
        }
      } catch {
        setItems(DEFAULT_ITEMS)
      }
    } else {
      setItems(DEFAULT_ITEMS)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ITEMS))
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // 监听全局点击以自动关闭右键菜单
  useEffect(() => {
    const handleCloseMenu = () => setContextMenu(null)
    window.addEventListener('click', handleCloseMenu)
    window.addEventListener('scroll', handleCloseMenu)
    return () => {
      window.removeEventListener('click', handleCloseMenu)
      window.removeEventListener('scroll', handleCloseMenu)
    }
  }, [])

  // 弹窗/抽屉开启时锁定底页滚动条
  useEffect(() => {
    if (isModalOpen || isArchiveDrawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isModalOpen, isArchiveDrawerOpen])

  const persistItems = (newItems: CountdownItem[]) => {
    setItems(newItems)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems))
  }

  // 修改事件重要程度
  const handleSetPriority = (id: string, priority: PriorityLevel) => {
    const updated = items.map((item) => (item.id === id ? { ...item, priority } : item))
    persistItems(updated)
    setContextMenu(null)
  }

  // 切换归档状态
  const handleToggleArchive = (id: string, archiveState = true) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, isArchived: archiveState } : item
    )
    persistItems(updated)
  }

  const handleArchiveAllExpired = () => {
    const now = Date.now()
    const updated = items.map((item) => {
      const isExpired = new Date(item.targetDate).getTime() <= now
      return isExpired ? { ...item, isArchived: true } : item
    })
    persistItems(updated)
  }

  const handleUnarchiveAll = () => {
    const updated = items.map((item) => ({ ...item, isArchived: false }))
    persistItems(updated)
  }

  const handleTogglePin = (id: string) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, isPinned: !item.isPinned } : item
    )
    persistItems(updated)
  }

  const handleExportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(items, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `deadlines_backup_${new Date().toISOString().slice(0, 10)}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string)
        if (Array.isArray(imported)) {
          persistItems(imported)
          alert('数据恢复成功！已同步至本地数据库。')
        } else {
          alert('导入失败：文件格式不符合要求')
        }
      } catch {
        alert('解析备份文件出错，请确保是正确的 JSON 文件')
      }
    }
    reader.readAsText(file)
  }

  const resetToDefaults = () => {
    if (confirm('确认恢复默认预设？将载入 15 个活跃倒计时及已归档示范案例。')) {
      persistItems(DEFAULT_ITEMS)
      setSelectedTag(null)
      setSearchQuery('')
    }
  }

  const activeItems = useMemo(() => items.filter((item) => !item.isArchived), [items])
  const archivedItems = useMemo(() => items.filter((item) => Boolean(item.isArchived)), [items])

  const allCategories = useMemo(() => {
    const set = new Set<string>()
    activeItems.forEach((item) => {
      if (item.category?.trim()) {
        set.add(item.category.trim().toUpperCase())
      }
    })
    return Array.from(set)
  }, [activeItems])

  // 🌿 1. 时间轴专属数据：严格按时间升序排布，绝对不被星标/置顶改变位置
  const timelineItems = useMemo(() => {
    let list = activeItems

    if (selectedTag) {
      list = list.filter((item) => item.category?.trim().toUpperCase() === selectedTag.toUpperCase())
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      list = list.filter(
        (item) =>
          item.title?.toLowerCase().includes(q) ||
          item.subtitle?.toLowerCase().includes(q) ||
          item.category?.toLowerCase().includes(q)
      )
    }

    // 纯粹依赖目标时间先后排序
    return [...list].sort(
      (a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
    )
  }, [activeItems, selectedTag, searchQuery])

  // 🎴 2. 卡片网格专属数据：星标置顶项优先展示在前，其余卡片按时间排列
  const cardGridItems = useMemo(() => {
    return [...timelineItems].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return 0
    })
  }, [timelineItems])

  const scrollToCard = (id: string) => {
    setHighlightedCardId(id)
    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current)
    }
    highlightTimeoutRef.current = setTimeout(() => {
      setHighlightedCardId(null)
    }, 900)

    const el = document.getElementById(`deadline-card-${id}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const handleCardClick = (url?: string) => {
    if (!url || !url.trim()) return
    const targetUrl = url.trim()
    const formattedUrl = /^https?:\/\//i.test(targetUrl) ? targetUrl : `https://${targetUrl}`
    window.open(formattedUrl, '_blank', 'noopener,noreferrer')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditingItem((prev) => ({ ...prev, image: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem.title || !editingItem.targetDate) {
      alert('请填写标题和截止日期')
      return
    }

    if (editingItem.id) {
      const updated = items.map((item) =>
        item.id === editingItem.id ? (editingItem as CountdownItem) : item
      )
      persistItems(updated)
    } else {
      const createdItem: CountdownItem = {
        ...(editingItem as CountdownItem),
        id: Date.now().toString(),
        priority: editingItem.priority || 'important',
        image:
          editingItem.image ||
          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        color: '#0071e3',
      }
      persistItems([createdItem, ...items])
    }
    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('确认删除该倒计时卡片吗？')) {
      persistItems(items.filter((item) => item.id !== id))
    }
  }

  const openCreateModal = () => {
    setEditingItem({
      category: selectedTag || 'TARGET',
      title: '',
      subtitle: '',
      targetDate: '',
      image: '',
      badgeText: '',
      link: '',
      isPinned: false,
      priority: 'important',
    })
    setIsModalOpen(true)
  }

  const openEditModal = (item: CountdownItem) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const ITEMS_PER_ROW = 5
  const totalItemsCount = timelineItems.length
  const totalRowsCount = Math.ceil(totalItemsCount / ITEMS_PER_ROW)

  const ROW_HEIGHT = 100
  const CIRCLE_Y_OFFSET = 30

  const sCurveSvgPath = useMemo(() => {
    if (totalItemsCount === 0) return ''

    let d = `M 35 ${CIRCLE_Y_OFFSET} C 55 ${CIRCLE_Y_OFFSET - 4}, 75 ${CIRCLE_Y_OFFSET + 4}, 100 ${CIRCLE_Y_OFFSET}`

    const waveOffsets = [
      [-7, 7],
      [7, -7],
      [-6, 8],
      [8, -6],
    ]

    for (let r = 0; r < totalRowsCount; r++) {
      const isEvenRow = r % 2 === 0
      const itemsInThisRow = Math.min(ITEMS_PER_ROW, totalItemsCount - r * ITEMS_PER_ROW)
      const currentY = r * ROW_HEIGHT + CIRCLE_Y_OFFSET

      if (isEvenRow) {
        for (let i = 0; i < itemsInThisRow - 1; i++) {
          const startX = 100 + i * 200
          const endX = startX + 200
          const [off1, off2] = waveOffsets[i % waveOffsets.length]
          d += ` C ${startX + 65} ${currentY + off1}, ${startX + 135} ${currentY + off2}, ${endX} ${currentY}`
        }

        if (r + 1 < totalRowsCount) {
          const nextY = (r + 1) * ROW_HEIGHT + CIRCLE_Y_OFFSET
          d += ` C 985 ${currentY}, 985 ${nextY}, 900 ${nextY}`
        }
      } else {
        for (let i = 0; i < itemsInThisRow - 1; i++) {
          const startX = 900 - i * 200
          const endX = startX - 200
          const [off1, off2] = waveOffsets[(i + 1) % waveOffsets.length]
          d += ` C ${startX - 65} ${currentY + off1}, ${startX - 135} ${currentY + off2}, ${endX} ${currentY}`
        }

        if (r + 1 < totalRowsCount) {
          const nextY = (r + 1) * ROW_HEIGHT + CIRCLE_Y_OFFSET
          d += ` C 15 ${currentY}, 15 ${nextY}, 100 ${nextY}`
        }
      }
    }
    return d
  }, [totalItemsCount, totalRowsCount])

  // 计算当前时间在严格按时间排布的 S 型轨迹上的准确指针坐标
  const todayArrowPos = useMemo(() => {
    if (timelineItems.length === 0) return null

    const getCoords = (idx: number) => {
      const r = Math.floor(idx / ITEMS_PER_ROW)
      const inRow = idx % ITEMS_PER_ROW
      const even = r % 2 === 0
      const col = even ? inRow : ITEMS_PER_ROW - 1 - inRow
      return {
        x: col * 200 + 100,
        y: r * ROW_HEIGHT + CIRCLE_Y_OFFSET,
        r,
        col,
        even,
      }
    }

    let lastPastIdx = -1
    for (let i = 0; i < timelineItems.length; i++) {
      const t = new Date(timelineItems[i].targetDate).getTime()
      if (t <= currentTime) {
        lastPastIdx = i
      }
    }

    if (lastPastIdx === -1) {
      const first = getCoords(0)
      return {
        x: Math.max(55, first.x - 35),
        y: first.y,
      }
    }

    if (lastPastIdx === timelineItems.length - 1) {
      const last = getCoords(lastPastIdx)
      const nextX = last.even ? Math.min(955, last.x + 40) : Math.max(45, last.x - 40)
      return {
        x: nextX,
        y: last.y,
      }
    }

    const nextIdx = lastPastIdx + 1
    const p = getCoords(lastPastIdx)
    const n = getCoords(nextIdx)

    const pTime = new Date(timelineItems[lastPastIdx].targetDate).getTime()
    const nTime = new Date(timelineItems[nextIdx].targetDate).getTime()
    let ratio = 0.5
    if (nTime > pTime) {
      const rawRatio = (currentTime - pTime) / (nTime - pTime)
      ratio = Math.max(0.22, Math.min(0.78, rawRatio))
    }

    if (p.r === n.r) {
      return {
        x: p.x + (n.x - p.x) * ratio,
        y: p.y,
      }
    }

    const isRightTurn = p.x >= 800
    const turnArcX = isRightTurn ? 950 : 50
    return {
      x: turnArcX,
      y: p.y + (n.y - p.y) * ratio,
    }
  }, [timelineItems, currentTime])

  const todayLabel = useMemo(() => {
    const d = new Date(currentTime)
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${m}/${day}`
  }, [currentTime])

  if (!mounted) return null

  return (
    <div
      style={{ fontFamily: appleFontFamily }}
      className="antialiased pb-20 w-screen relative left-1/2 -translate-x-1/2 px-4 sm:px-8 xl:px-14 max-w-[1720px] mx-auto box-border"
    >
      <style>{`
        @keyframes cardSpringPop {
          0% { transform: scale(1) translateY(0); }
          18% { transform: scale(1.08) translateY(-22px); }
          38% { transform: scale(0.97) translateY(4px); }
          58% { transform: scale(1.03) translateY(-8px); }
          78% { transform: scale(0.99) translateY(2px); }
          100% { transform: scale(1) translateY(0); }
        }
        .animate-spring-pop {
          animation: cardSpringPop 1.1s cubic-bezier(0.2, 0.8, 0.2, 1) both;
          will-change: transform;
        }

        @keyframes glintSweep {
          0% { transform: translateX(-160%) skewX(-25deg); opacity: 0; }
          20% { opacity: 0.9; }
          65% { opacity: 0.9; }
          100% { transform: translateX(260%) skewX(-25deg); opacity: 0; }
        }
        .animate-glint-sweep {
          animation: glintSweep 1.1s cubic-bezier(0.25, 1, 0.5, 1) both;
        }

        @keyframes stampSmack {
          0% { transform: scale(2.2) rotate(-20deg); opacity: 0; }
          60% { transform: scale(0.96) rotate(-11deg); opacity: 1; }
          100% { transform: scale(1) rotate(-13deg); opacity: 0.92; }
        }
        .animate-stamp {
          animation: stampSmack 0.45s cubic-bezier(0.17, 0.89, 0.32, 1.25) forwards;
        }
      `}</style>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleImportBackup}
      />

      {/* 顶部标题栏 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 pt-6 pb-5">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-[-0.025em] text-gray-900 dark:text-gray-100">
            Deadline
          </h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1.5 tracking-tight">
            Done is better than perfect! 
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {/* 🔍 搜索框 */}
          <div className="relative flex items-center">
            <svg
              className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="try to search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-7 py-1 text-xs rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-blue-500 w-32 sm:w-44 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 text-neutral-400 hover:text-neutral-200 text-xs cursor-pointer"
                title="清除搜索"
              >
                ×
              </button>
            )}
          </div>

          {/* 🗄️ 归档抽屉入口按钮 */}
          <button
            onClick={() => setIsArchiveDrawerOpen(true)}
            className="inline-flex items-center space-x-1.5 text-xs font-medium text-neutral-400 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors cursor-pointer px-1 py-1"
            title="查看已归档的倒计时"
          >
            <span>Archive</span>
            {archivedItems.length > 0 && (
              <span className="bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[10px] font-mono px-1.5 py-0.2 rounded-full">
                {archivedItems.length}
              </span>
            )}
          </button>

          <button
            onClick={handleExportBackup}
            title="将所有数据下载为 JSON 文件保存到电脑"
            className="text-xs font-medium text-neutral-400 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors cursor-pointer px-1 py-1"
          >
            export
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            title="上传 JSON 恢复数据"
            className="text-xs font-medium text-neutral-400 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors cursor-pointer px-1 py-1"
          >
            import
          </button>
          <button
            onClick={resetToDefaults}
            className="text-xs font-medium text-neutral-400 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors cursor-pointer px-1 py-1"
          >
            default
          </button>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-500 active:scale-95 transition-all ml-1 cursor-pointer"
          >
            + Add
          </button>
        </div>
      </div>

      {/* 标签分类栏 */}
      <div className="py-2.5">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3.5 py-1 rounded-full text-xs font-medium tracking-tight transition-all active:scale-95 whitespace-nowrap cursor-pointer ${
              selectedTag === null
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-sm'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
          >
            All ({activeItems.length})
          </button>
          {allCategories.map((cat) => {
            const isSelected = selectedTag?.toUpperCase() === cat
            const count = activeItems.filter((i) => i.category?.trim().toUpperCase() === cat).length
            return (
              <button
                key={cat}
                onClick={() => setSelectedTag(cat)}
                className={`px-3.5 py-1 rounded-full text-xs font-medium tracking-tight transition-all active:scale-95 whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                {cat} ({count})
              </button>
            )
          })}
          {(selectedTag || searchQuery) && (
            <button
              onClick={() => {
                setSelectedTag(null)
                setSearchQuery('')
              }}
              className="text-xs text-blue-500 hover:text-blue-400 ml-2 whitespace-nowrap underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* 🌿 自然蜿蜒曲折的 Git Commit GUI 时间线（严格按时间升序） */}
      {timelineItems.length > 0 && (
        <div className="pt-6 pb-10">
          <div
            className="relative w-full select-none"
            style={{ minHeight: `${totalRowsCount * ROW_HEIGHT}px` }}
          >
            <svg
              viewBox={`0 0 1000 ${totalRowsCount * ROW_HEIGHT}`}
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full pointer-events-none"
            >
              <path
                d={sCurveSvgPath}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-neutral-200 dark:text-neutral-800 transition-all duration-300"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {/* 🔴 表示当前日期的精巧小红箭头与指示器 */}
            {todayArrowPos && (
              <div
                className="absolute z-30 flex flex-col items-center pointer-events-none transition-all duration-300 -translate-x-1/2"
                style={{
                  left: `${(todayArrowPos.x / 1000) * 100}%`,
                  top: `${todayArrowPos.y}px`,
                }}
              >
                <div className="-translate-y-[21px] flex flex-col items-center">
                  <div className="flex items-center space-x-1 bg-red-600 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full shadow-sm shadow-red-500/40 tracking-tight leading-none whitespace-nowrap">
                    <span>TODAY</span>
                    <span className="text-red-200 text-[8px] font-normal">{todayLabel}</span>
                  </div>
                  <svg
                    className="w-2.5 h-2.5 text-red-600 -mt-0.5 drop-shadow-xs"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 21l-10-14h20z" />
                  </svg>
                </div>

                <div className="absolute top-0 -translate-y-1/2 flex items-center justify-center">
                  <span className="absolute w-3.5 h-3.5 rounded-full bg-red-500/40 animate-ping" />
                  <span className="w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-neutral-900 shadow-[0_0_8px_rgba(239,68,68,0.9)]" />
                </div>
              </div>
            )}

            {/* Git 起始 main 徽章 */}
            <div
              className="absolute left-0 flex items-center space-x-1.5 z-20"
              style={{ top: `${CIRCLE_Y_OFFSET - 11}px` }}
            >
              <svg
                className="w-3.5 h-3.5 text-blue-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="6" y1="3" x2="6" y2="15"></line>
                <circle cx="18" cy="6" r="3"></circle>
                <circle cx="6" cy="18" r="3"></circle>
                <path d="M18 9a9 9 0 0 1-9 9"></path>
              </svg>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                main
              </span>
            </div>

            {/* 按行渲染节点（严格按时间升序） */}
            {Array.from({ length: totalRowsCount }).map((_, rowIndex) => {
              const isEvenRow = rowIndex % 2 === 0
              const rowItems = timelineItems.slice(
                rowIndex * ITEMS_PER_ROW,
                (rowIndex + 1) * ITEMS_PER_ROW
              )

              const slots = new Array(5).fill(null)
              rowItems.forEach((item, indexInRow) => {
                const targetCol = isEvenRow ? indexInRow : 4 - indexInRow
                const globalIndex = rowIndex * ITEMS_PER_ROW + indexInRow
                slots[targetCol] = { item, globalIndex }
              })

              return (
                <div
                  key={rowIndex}
                  className="grid grid-cols-5 w-full relative"
                  style={{ height: `${ROW_HEIGHT}px` }}
                >
                  {slots.map((slot, colIndex) => {
                    if (!slot) return <div key={colIndex} />

                    const { item, globalIndex } = slot
                    const isHead = globalIndex === 0
                    const isHighlighted = highlightedCardId === item.id
                    const targetTime = new Date(item.targetDate).getTime()
                    const diffDays = Math.ceil(
                      Math.max(0, targetTime - currentTime) / (1000 * 60 * 60 * 24)
                    )

                    // 纯粹使用节点本身的颜色
                    const nodeColor = item.color || '#0071e3'
                    const priority = item.priority || 'important'

                    const isCritical = priority === 'critical'
                    const isMedium = priority === 'medium'

                    // 节点物理尺寸缩放
                    const outerSizeClass = isCritical
                      ? 'w-[24px] h-[24px] border-[2.5px]'
                      : isMedium
                      ? 'w-[18px] h-[18px] border-2'
                      : 'w-[13px] h-[13px] border-2'

                    const innerSizeClass = isCritical
                      ? 'w-[9px] h-[9px]'
                      : isMedium
                      ? 'w-[6px] h-[6px]'
                      : 'w-[4px] h-[4px]'

                    return (
                      <div
                        key={item.id}
                        onClick={() => scrollToCard(item.id)}
                        onContextMenu={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setContextMenu({
                            x: e.clientX,
                            y: e.clientY,
                            itemId: item.id,
                          })
                        }}
                        className={`group flex flex-col items-center cursor-pointer transition-transform duration-150 active:scale-95 z-10 ${
                          isHighlighted ? 'scale-110' : ''
                        }`}
                        title="左键定位卡片，右键调整重要程度"
                      >
                        {/* 节点上方标签：HEAD 或 真实日期 mm/dd-yyyy */}
                        <div className="h-[20px] flex items-center justify-center">
                          {isHead ? (
                            <span className="text-[9px] font-mono font-bold bg-blue-600 text-white px-2 py-0.2 rounded-full shadow-sm animate-pulse tracking-tight flex items-center gap-1">
                              {item.isPinned && <span className="text-white text-[8px]">★</span>}
                              HEAD
                            </span>
                          ) : (
                            <span
                              className={`text-[10px] font-mono transition-colors flex items-center gap-0.5 ${
                                isHighlighted
                                  ? 'text-blue-500 font-bold'
                                  : 'text-neutral-400 group-hover:text-blue-500'
                              }`}
                            >
                              {item.isPinned && <span className="text-white/80 text-[9px]">★</span>}
                              {formatDateBadge(item.targetDate)}
                            </span>
                          )}
                        </div>

                        {/* 节点本体 */}
                        <div
                          className="relative flex items-center justify-center"
                          style={{ height: '20px' }}
                        >
                          {(isHead || isHighlighted) && (
                            <span className="absolute rounded-full transition-all animate-ping w-5 h-5 bg-blue-500/40" />
                          )}

                          {isCritical && !isHead && !isHighlighted && (
                            <span
                              className="absolute rounded-full pointer-events-none"
                              style={{
                                width: '30px',
                                height: '30px',
                                backgroundColor: nodeColor,
                                opacity: 0.16,
                              }}
                            />
                          )}

                          <div
                            style={{
                              borderColor: isHead || isHighlighted ? '#0071e3' : nodeColor,
                            }}
                            className={`rounded-full bg-white dark:bg-neutral-900 flex items-center justify-center transition-all duration-200 ${outerSizeClass} ${
                              isHead || isHighlighted
                                ? 'border-blue-600 bg-blue-600 shadow-md'
                                : 'group-hover:scale-110 shadow-xs'
                            }`}
                          >
                            <div
                              style={{
                                backgroundColor: isHead ? '#ffffff' : nodeColor,
                              }}
                              className={`rounded-full transition-all ${innerSizeClass}`}
                            />
                          </div>
                        </div>

                        {/* 节点标题 */}
                        <div className="text-center w-full px-1 mt-0.5">
                          <div
                            className={`text-xs truncate transition-colors ${
                              isHighlighted
                                ? 'text-blue-600 dark:text-blue-400 font-bold'
                                : isCritical
                                ? 'text-neutral-900 dark:text-white font-bold'
                                : 'text-neutral-800 dark:text-neutral-200 font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400'
                            }`}
                          >
                            {item.title}
                          </div>
                          <div className="flex items-center justify-center space-x-1 text-[10px] font-mono text-neutral-400">
                            <span>{item.category}</span>
                            <span>·</span>
                            <span className="text-blue-600 dark:text-blue-400 font-medium">
                              {diffDays <= 0 ? '已截止' : `${diffDays}d`}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 倒计时卡片网格（置顶卡片排在首位） */}
      <div className="pt-2">
        {cardGridItems.length === 0 ? (
          <div className="text-center py-20 text-neutral-400">
            <p className="text-base font-medium">未找到相关的倒计时事件</p>
            <button
              onClick={() => {
                setSelectedTag(null)
                setSearchQuery('')
              }}
              className="mt-3 text-sm text-blue-500 hover:underline cursor-pointer"
            >
              清空筛选条件展示全部
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 landscape:lg:grid-cols-5 gap-5 xl:gap-5">
            {cardGridItems.map((item) => {
              const isTargeted = highlightedCardId === item.id
              const isOtherCardDimmed = highlightedCardId !== null && !isTargeted

              const targetTime = new Date(item.targetDate).getTime()
              const diffMs = targetTime - currentTime
              const isExpired = diffMs <= 0

              const safeDiffMs = Math.max(0, diffMs)
              const totalHours = Math.floor(safeDiffMs / (1000 * 60 * 60))
              const days = Math.floor(safeDiffMs / (1000 * 60 * 60 * 24))
              const hours = Math.floor((safeDiffMs / (1000 * 60 * 60)) % 24)
              const minutes = Math.floor((safeDiffMs / (1000 * 60)) % 60)
              const seconds = Math.floor((safeDiffMs / 1000) % 60)

              const hasLink = Boolean(item.link?.trim())

              return (
                <div
                  id={`deadline-card-${item.id}`}
                  key={item.id}
                  onClick={() => handleCardClick(item.link)}
                  title={hasLink ? `点击前往: ${item.link}` : undefined}
                  className={`group relative flex flex-col justify-between aspect-[7/10] min-h-[350px] rounded-2xl overflow-hidden border bg-neutral-950 select-none transition-all duration-300 ${
                    item.isPinned
                      ? 'scale-[1.03] z-10 border-white/30 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.8)] hover:scale-[1.05]'
                      : 'scale-100 border-white/10 hover:-translate-y-1.5 shadow-2xl'
                  } ${hasLink ? 'cursor-pointer hover:border-blue-500/40' : ''} ${
                    isTargeted
                      ? 'animate-spring-pop z-30 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]'
                      : isOtherCardDimmed
                      ? 'opacity-35 scale-[0.985] shadow-md filter brightness-75'
                      : 'opacity-100'
                  }`}
                >
                  {/* ✨ 镜面流光层 */}
                  {isTargeted && (
                    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-2xl">
                      <div className="w-[120%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-glint-sweep" />
                    </div>
                  )}

                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/35 to-black/95" />

                  {/* 📜 复古红色敲章印迹 */}
                  {isExpired && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 overflow-hidden">
                      <div className="animate-stamp border-[3.5px] border-dashed border-red-500/90 bg-red-950/40 backdrop-blur-xs text-red-400 px-5 py-2 rounded-xl text-center shadow-[0_0_25px_rgba(239,68,68,0.35)]">
                        <div className="text-[10px] tracking-[0.25em] font-mono font-bold uppercase text-red-300/80">
                          DEADLINE REACHED
                        </div>
                        <div className="text-xl sm:text-2xl font-black tracking-widest uppercase text-red-500 mt-0.5">
                          PASSED · 达成
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 卡片头部 */}
                  <div className="relative z-10 p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-1.5 mb-2.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedTag(item.category?.trim().toUpperCase() || 'OTHER')
                        }}
                        title={`筛选 ${item.category || 'OTHER'}`}
                        className="bg-white/95 hover:bg-white text-black text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full tracking-wider uppercase shadow-sm cursor-pointer active:scale-95 transition-all truncate max-w-[110px]"
                      >
                        {item.category || 'OTHER'}
                      </button>

                      <div className="flex items-center space-x-1">
                        {/* 浮动操作组：仅在鼠标悬停时平滑显现 */}
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {/* 🌟 极简白星按钮 */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleTogglePin(item.id)
                            }}
                            title={item.isPinned ? '取消置顶' : '置顶此事件'}
                            className={`p-1 rounded-full border backdrop-blur-md transition-all active:scale-90 cursor-pointer ${
                              item.isPinned
                                ? 'bg-white text-black border-white shadow-md'
                                : 'bg-black/60 text-white/40 hover:text-white border-white/15'
                            }`}
                          >
                            <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              openEditModal(item)
                            }}
                            className="bg-black/60 hover:bg-black/90 text-[10px] font-medium text-white/90 px-2 py-0.5 rounded-full border border-white/15 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(item.id)
                            }}
                            className="bg-red-500/30 hover:bg-red-500/50 text-[10px] font-medium text-red-200 px-2 py-0.5 rounded-full border border-red-500/30 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
                          >
                            Del
                          </button>
                        </div>

                        {hasLink && (
                          <span
                            title="包含跳转链接"
                            className="text-neutral-400 group-hover:text-blue-400 bg-black/60 backdrop-blur-md p-1 rounded-full border border-white/15 transition-colors"
                          >
                            <svg
                              className="w-2.5 h-2.5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                              <polyline points="15 3 21 3 21 9"></polyline>
                              <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                          </span>
                        )}

                        {/* 📅 日期角标：mm/dd-yyyy */}
                        <span className="text-[10px] sm:text-[11px] font-mono font-semibold text-neutral-200 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/15 tracking-tight shadow-sm whitespace-nowrap">
                          {formatDateBadge(item.targetDate)}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-[-0.02em] leading-tight line-clamp-2 drop-shadow-md">
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <p className="text-[11px] sm:text-xs font-medium text-neutral-300/90 tracking-[-0.01em] mt-1.5 line-clamp-1 sm:line-clamp-2 drop-shadow">
                        {item.subtitle}
                      </p>
                    )}
                  </div>

                  {/* 卡片中央 */}
                  <div className="relative z-10 flex flex-col items-center justify-center my-auto px-3">
                    <div className="bg-black/55 backdrop-blur-xl px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-white/15 text-center shadow-2xl max-w-full">
                      <span className="text-[9px] sm:text-[10px] font-semibold text-neutral-300 uppercase tracking-[0.08em] block mb-0.5 whitespace-nowrap">
                        {isExpired ? 'MILESTONE REACHED' : 'TOTAL HOURS REMAINING'}
                      </span>
                      <div className="text-3xl sm:text-4xl xl:text-3xl 2xl:text-4xl font-bold text-white tracking-[-0.03em] tabular-nums leading-none mt-1">
                        {totalHours.toLocaleString()}
                        <span className="text-base sm:text-lg font-medium text-neutral-400 ml-1 tracking-normal">
                          h
                        </span>
                      </div>
                    </div>

                    {item.badgeText && (
                      <div className="mt-2.5">
                        <span className="bg-red-600/80 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-semibold px-2.5 py-0.5 rounded-full tracking-widest uppercase shadow">
                          {item.badgeText}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 卡片底部 */}
                  <div className="relative z-10 bg-black/80 backdrop-blur-md border-t border-white/10 py-3 px-2">
                    <div className="grid grid-cols-4 text-center divide-x divide-white/10">
                      <div className="px-0.5">
                        <div className="text-xl sm:text-2xl font-bold text-white tracking-[-0.02em] tabular-nums leading-none">
                          {days}
                        </div>
                        <div className="text-[8px] sm:text-[9px] font-medium text-neutral-400 tracking-[0.06em] uppercase mt-1">
                          DAYS
                        </div>
                      </div>
                      <div className="px-0.5">
                        <div className="text-xl sm:text-2xl font-bold text-white tracking-[-0.02em] tabular-nums leading-none">
                          {hours}
                        </div>
                        <div className="text-[8px] sm:text-[9px] font-medium text-neutral-400 tracking-[0.06em] uppercase mt-1">
                          HOURS
                        </div>
                      </div>
                      <div className="px-0.5">
                        <div className="text-xl sm:text-2xl font-bold text-white tracking-[-0.02em] tabular-nums leading-none">
                          {minutes}
                        </div>
                        <div className="text-[8px] sm:text-[9px] font-medium text-neutral-400 tracking-[0.06em] uppercase mt-1">
                          MINS
                        </div>
                      </div>
                      <div className="px-0.5">
                        <div className="text-xl sm:text-2xl font-bold text-white tracking-[-0.02em] tabular-nums leading-none">
                          {seconds}
                        </div>
                        <div className="text-[8px] sm:text-[9px] font-medium text-neutral-400 tracking-[0.06em] uppercase mt-1">
                          SECS
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 🖱️ 右键快捷菜单 */}
      {contextMenu &&
        createPortal(
          <div
            className="fixed z-[999999] rounded-2xl bg-neutral-900/95 border border-white/15 p-1.5 shadow-2xl backdrop-blur-xl animate-fade-in flex flex-col min-w-[155px] text-xs"
            style={{
              left: Math.min(contextMenu.x, window.innerWidth - 175),
              top: Math.min(contextMenu.y, window.innerHeight - 150),
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-2.5 py-1 text-[10px] font-semibold text-neutral-400 border-b border-neutral-800 uppercase tracking-wider mb-1">
              设定节点重要度
            </div>

            <button
              onClick={() => handleSetPriority(contextMenu.itemId, 'critical')}
              className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-neutral-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer group"
            >
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full border-2 border-white/80 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </span>
                <span>极度重要 (大)</span>
              </span>
              {items.find((i) => i.id === contextMenu.itemId)?.priority === 'critical' && (
                <span className="text-blue-400 font-bold">✓</span>
              )}
            </button>

            <button
              onClick={() => handleSetPriority(contextMenu.itemId, 'medium')}
              className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-neutral-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer group"
            >
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full border border-white/60 flex items-center justify-center">
                  <span className="w-1 h-1 rounded-full bg-white/60" />
                </span>
                <span>中等重要 (中)</span>
              </span>
              {items.find((i) => i.id === contextMenu.itemId)?.priority === 'medium' && (
                <span className="text-blue-400 font-bold">✓</span>
              )}
            </button>

            <button
              onClick={() => handleSetPriority(contextMenu.itemId, 'important')}
              className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-neutral-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer group"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full border border-white/40 flex items-center justify-center">
                  <span className="w-0.5 h-0.5 rounded-full bg-white/40" />
                </span>
                <span>重要 (标准)</span>
              </span>
              {(items.find((i) => i.id === contextMenu.itemId)?.priority || 'important') === 'important' && (
                <span className="text-blue-400 font-bold">✓</span>
              )}
            </button>
          </div>,
          document.body
        )}

      {/* 🗄️ 历史归档抽屉 */}
      {isArchiveDrawerOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsArchiveDrawerOpen(false)
            }}
          >
            <div className="w-full max-w-md h-full bg-neutral-900 border-l border-white/10 flex flex-col shadow-2xl text-white">
              <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">归档箱 (Archive)</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    已归档 {archivedItems.length} 项 · 活跃 {activeItems.length} 项
                  </p>
                </div>
                <button
                  onClick={() => setIsArchiveDrawerOpen(false)}
                  className="p-1 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex border-b border-neutral-800 px-5 pt-2 gap-4 bg-neutral-900/60">
                <button
                  onClick={() => setArchiveDrawerTab('list')}
                  className={`pb-2.5 text-xs font-semibold tracking-tight transition-colors cursor-pointer border-b-2 ${
                    archiveDrawerTab === 'list'
                      ? 'border-blue-500 text-white'
                      : 'border-transparent text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  已归档记录 ({archivedItems.length})
                </button>
                <button
                  onClick={() => setArchiveDrawerTab('select')}
                  className={`pb-2.5 text-xs font-semibold tracking-tight transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
                    archiveDrawerTab === 'select'
                      ? 'border-blue-500 text-white'
                      : 'border-transparent text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <span>手动勾选归档</span>
                  <span className="text-[10px] bg-neutral-800 px-1.5 py-0.2 rounded-full font-mono text-neutral-300">
                    {items.length}
                  </span>
                </button>
              </div>

              {archiveDrawerTab === 'list' && (
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {archivedItems.length === 0 ? (
                    <div className="text-center py-24 text-neutral-500 text-sm">
                      <p>暂无已归档事件</p>
                      <button
                        onClick={() => setArchiveDrawerTab('select')}
                        className="mt-3 text-xs text-blue-500 hover:underline cursor-pointer"
                      >
                        去「手动勾选归档」选择卡片 →
                      </button>
                    </div>
                  ) : (
                    archivedItems.map((archived) => (
                      <div
                        key={archived.id}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-800/80 border border-neutral-700/60"
                      >
                        <div
                          className="w-14 h-14 rounded-xl bg-cover bg-center shrink-0 border border-white/10"
                          style={{ backgroundImage: `url(${archived.image})` }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                            {archived.category}
                          </div>
                          <h4 className="text-sm font-bold text-white truncate mt-0.5">
                            {archived.title}
                          </h4>
                          <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                            达成: {formatDateBadge(archived.targetDate)}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5 shrink-0">
                          <button
                            onClick={() => handleToggleArchive(archived.id, false)}
                            className="px-2.5 py-1 text-[11px] rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all active:scale-95 cursor-pointer"
                          >
                            恢复
                          </button>
                          <button
                            onClick={() => handleDelete(archived.id)}
                            className="px-2.5 py-1 text-[11px] rounded-full bg-neutral-700 hover:bg-red-500/80 text-neutral-300 hover:text-white transition-all active:scale-95 cursor-pointer"
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {archiveDrawerTab === 'select' && (
                <div className="flex flex-col flex-1 overflow-hidden">
                  <div className="px-4 py-2.5 bg-neutral-950/40 border-b border-neutral-800/60 flex items-center justify-between text-xs">
                    <span className="text-neutral-400">勾选以移入归档</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleArchiveAllExpired}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 cursor-pointer"
                      >
                        全选已截止
                      </button>
                      <button
                        onClick={handleUnarchiveAll}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 cursor-pointer"
                      >
                        清空勾选
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {items.map((item) => {
                      const isArchived = Boolean(item.isArchived)
                      const isExpired = new Date(item.targetDate).getTime() <= currentTime

                      return (
                        <div
                          key={item.id}
                          onClick={() => handleToggleArchive(item.id, !isArchived)}
                          className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                            isArchived
                              ? 'bg-blue-950/20 border-blue-500/40 text-white'
                              : 'bg-neutral-800/50 border-neutral-800/80 text-neutral-300 hover:bg-neutral-800'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isArchived}
                            onChange={() => {}}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-0 border-neutral-700 bg-neutral-800 pointer-events-none cursor-pointer"
                          />

                          <div
                            className="w-11 h-11 rounded-lg bg-cover bg-center shrink-0 border border-white/10"
                            style={{ backgroundImage: `url(${item.image})` }}
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-semibold text-neutral-400 uppercase">
                                {item.category}
                              </span>
                              {isExpired && (
                                <span className="text-[9px] bg-red-950 text-red-400 border border-red-800/50 px-1 rounded">
                                  已截止
                                </span>
                              )}
                              {item.isPinned && (
                                <span className="text-[9px] text-white">★</span>
                              )}
                            </div>
                            <h4 className="text-xs font-bold truncate mt-0.5">{item.title}</h4>
                            <div className="text-[10px] text-neutral-500 font-mono">
                              {formatDateBadge(item.targetDate)}
                            </div>
                          </div>

                          <span className="text-[11px] font-mono text-neutral-400 shrink-0">
                            {isArchived ? '已归档' : '看板中'}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}

      {/* 弹窗：编辑与新增（React Portal） */}
      {isModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/75 p-3 sm:p-5 backdrop-blur-md animate-fade-in"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsModalOpen(false)
            }}
          >
            <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl bg-neutral-900 text-white shadow-2xl border border-white/15 overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between shrink-0">
                <h2 className="text-lg font-bold tracking-tight text-white">
                  {editingItem.id ? 'Edit Countdown' : 'New Countdown'}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-neutral-400 hover:text-white p-1 rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="flex flex-col flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 pr-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                        Category (分类标签)
                      </label>
                      <input
                        type="text"
                        placeholder="如: EXAM, GAME"
                        value={editingItem.category || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-800/90 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                        Badge Status (可选)
                      </label>
                      <input
                        type="text"
                        placeholder="如: UNCONFIRMED"
                        value={editingItem.badgeText || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, badgeText: e.target.value })}
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-800/90 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                      Title (标题)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="如: 考研初试 / 毕业答辩"
                      value={editingItem.title || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-800/90 px-3.5 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                      Subtitle (副标题)
                    </label>
                    <input
                      type="text"
                      placeholder="如: 目标分数 380+ / 论文最终提交"
                      value={editingItem.subtitle || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, subtitle: e.target.value })}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-800/90 px-3.5 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* 重要程度设置 */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                      Priority (重要程度 / 节点尺寸)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: 'critical', label: '极度重要 (大)' },
                        { key: 'medium', label: '中等重要 (中)' },
                        { key: 'important', label: '重要 (标准)' },
                      ].map((p) => {
                        const isSelected = (editingItem.priority || 'important') === p.key
                        return (
                          <button
                            key={p.key}
                            type="button"
                            onClick={() =>
                              setEditingItem({ ...editingItem, priority: p.key as PriorityLevel })
                            }
                            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                              isSelected
                                ? 'border-white bg-white/10 text-white shadow-sm'
                                : 'border-neutral-800 bg-neutral-800/60 text-neutral-400 hover:bg-neutral-800 hover:text-white'
                            }`}
                          >
                            <span>{p.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* 置顶勾选 */}
                  <div className="flex items-center gap-2 pt-1 pb-1">
                    <input
                      type="checkbox"
                      id="pin-checkbox"
                      checked={editingItem.isPinned || false}
                      onChange={(e) => setEditingItem({ ...editingItem, isPinned: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-neutral-700 bg-neutral-800 cursor-pointer"
                    />
                    <label htmlFor="pin-checkbox" className="text-xs font-medium text-neutral-300 cursor-pointer select-none">
                      ★ 置顶该事件（下方网格优先展示）
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                      Link (自定义跳转链接，可选)
                    </label>
                    <input
                      type="text"
                      placeholder="如: https://example.com"
                      value={editingItem.link || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, link: e.target.value })}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-800/90 px-3.5 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                      Target Deadline (截止时间)
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={editingItem.targetDate || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, targetDate: e.target.value })}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-800/90 px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                      Background Image (上传背景图)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="w-full text-xs text-neutral-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-neutral-800 file:text-neutral-200 hover:file:bg-neutral-700 cursor-pointer"
                    />
                    <input
                      type="url"
                      placeholder="或输入图片 URL: https://..."
                      value={editingItem.image || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-neutral-800 bg-neutral-800/90 px-3.5 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="px-6 py-3.5 bg-neutral-900/95 border-t border-neutral-800 flex items-center justify-end space-x-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white rounded-full transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 active:scale-95 rounded-full shadow transition-all cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
```

