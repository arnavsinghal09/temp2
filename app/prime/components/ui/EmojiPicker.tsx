"use client"

import { useState } from "react"

const emojiCategories = {
  smileys: {
    name: "Smileys & People",
    emojis: [
      "😀",
      "😃",
      "😄",
      "😁",
      "😆",
      "😅",
      "😂",
      "🤣",
      "😊",
      "😇",
      "🙂",
      "🙃",
      "😉",
      "😌",
      "😍",
      "🥰",
      "😘",
      "😗",
      "😙",
      "😚",
      "😋",
      "😛",
      "😝",
      "😜",
      "🤪",
      "🤨",
      "🧐",
      "🤓",
      "😎",
      "🤩",
      "🥳",
      "😏",
      "😒",
      "😞",
      "😔",
      "😟",
      "😕",
      "🙁",
      "☹️",
      "😣",
      "😖",
      "😫",
      "😩",
      "🥺",
      "😢",
      "😭",
      "😤",
      "😠",
      "😡",
      "🤬",
      "🤯",
      "😳",
      "🥵",
      "🥶",
      "😱",
      "😨",
      "😰",
      "😥",
      "😓",
      "🤗",
      "🤔",
      "🤭",
      "🤫",
      "🤥",
      "😶",
      "😐",
      "😑",
      "😬",
      "🙄",
      "😯",
      "😦",
      "😧",
      "😮",
      "😲",
      "🥱",
      "😴",
      "🤤",
      "😪",
      "😵",
      "🤐",
      "🥴",
      "🤢",
      "🤮",
      "🤧",
      "😷",
      "🤒",
      "🤕",
      "🤑",
      "🤠",
      "😈",
      "👿",
      "👹",
      "👺",
      "🤡",
      "💩",
      "👻",
      "💀",
      "☠️",
      "👽",
      "👾",
      "🤖",
      "🎃",
      "😺",
      "😸",
      "😹",
      "😻",
      "😼",
      "😽",
      "🙀",
      "😿",
      "😾",
    ],
  },
  gestures: {
    name: "Gestures",
    emojis: [
      "👍",
      "👎",
      "👌",
      "🤌",
      "🤏",
      "✌️",
      "🤞",
      "🤟",
      "🤘",
      "🤙",
      "👈",
      "👉",
      "👆",
      "🖕",
      "👇",
      "☝️",
      "👋",
      "🤚",
      "🖐️",
      "✋",
      "🖖",
      "👏",
      "🙌",
      "🤲",
      "🤝",
      "🙏",
      "✍️",
      "💪",
      "🦾",
      "🦿",
      "🦵",
      "🦶",
      "👂",
      "🦻",
      "👃",
      "🧠",
      "🫀",
      "🫁",
      "🦷",
      "🦴",
      "👀",
      "👁️",
      "👅",
      "👄",
      "💋",
      "🩸",
      "👶",
      "🧒",
      "👦",
      "👧",
      "🧑",
      "👱",
      "👨",
      "🧔",
      "👩",
      "🧓",
      "👴",
      "👵",
      "🙍",
      "🙎",
      "🙅",
      "🙆",
      "💁",
      "🙋",
      "🧏",
      "🙇",
      "🤦",
      "🤷",
      "👮",
      "🕵️",
      "💂",
      "🥷",
      "👷",
      "🤴",
      "👸",
    ],
  },
  activities: {
    name: "Activities",
    emojis: [
      "⚽",
      "🏀",
      "🏈",
      "⚾",
      "🥎",
      "🎾",
      "🏐",
      "🏉",
      "🥏",
      "🎱",
      "🪀",
      "🏓",
      "🏸",
      "🏒",
      "🏑",
      "🥍",
      "🏏",
      "🪃",
      "🥅",
      "⛳",
      "🪁",
      "🏹",
      "🎣",
      "🤿",
      "🥊",
      "🥋",
      "🎽",
      "🛹",
      "🛷",
      "⛸️",
      "🥌",
      "🎿",
      "⛷️",
      "🏂",
      "🪂",
      "🏋️",
      "🤼",
      "🤸",
      "⛹️",
      "🤺",
      "🤾",
      "🏌️",
      "🏇",
      "🧘",
      "🏄",
      "🏊",
      "🤽",
      "🚣",
      "🧗",
      "🚵",
      "🚴",
      "🏆",
      "🥇",
      "🥈",
      "🥉",
      "🏅",
      "🎖️",
      "🏵️",
      "🎗️",
      "🎫",
      "🎟️",
      "🎪",
      "🤹",
      "🎭",
      "🩰",
      "🎨",
      "🎬",
      "🎤",
      "🎧",
      "🎼",
      "🎵",
      "🎶",
      "🥁",
      "🪘",
      "🎹",
    ],
  },
  objects: {
    name: "Objects",
    emojis: [
      "🎬",
      "🎭",
      "🎨",
      "🎰",
      "🚗",
      "🚕",
      "🚙",
      "🚌",
      "🚎",
      "🏎️",
      "🚓",
      "🚑",
      "🚒",
      "🚐",
      "🛻",
      "🚚",
      "🚛",
      "🚜",
      "🏍️",
      "🛵",
      "🚲",
      "🛴",
      "🛹",
      "🛼",
      "🚁",
      "🛸",
      "🚀",
      "✈️",
      "🛩️",
      "🛫",
      "🛬",
      "🪂",
      "💺",
      "🚢",
      "⛵",
      "🚤",
      "🛥️",
      "🛳️",
      "⛴️",
      "🚟",
      "🚠",
      "🚡",
      "🚂",
      "🚃",
      "🚄",
      "🚅",
      "🚆",
      "🚇",
      "🚈",
      "🚉",
      "🚊",
      "🚝",
      "🚞",
      "🚋",
      "🚌",
      "🚍",
      "🎡",
      "🎢",
      "🎠",
      "⛲",
      "⛱️",
      "🏖️",
      "🏝️",
      "🏜️",
      "🌋",
      "⛰️",
      "🏔️",
      "🗻",
      "🏕️",
      "⛺",
      "🛖",
      "🏠",
      "🏡",
      "🏘️",
      "🏚️",
    ],
  },
  symbols: {
    name: "Symbols",
    emojis: [
      "❤️",
      "🧡",
      "💛",
      "💚",
      "💙",
      "💜",
      "🖤",
      "🤍",
      "🤎",
      "💔",
      "❣️",
      "💕",
      "💞",
      "💓",
      "💗",
      "💖",
      "💘",
      "💝",
      "💟",
      "☮️",
      "✝️",
      "☪️",
      "🕉️",
      "☸️",
      "✡️",
      "🔯",
      "🕎",
      "☯️",
      "☦️",
      "🛐",
      "⛎",
      "♈",
      "♉",
      "♊",
      "♋",
      "♌",
      "♍",
      "♎",
      "♏",
      "♐",
      "♑",
      "♒",
      "♓",
      "🆔",
      "⚛️",
      "🉑",
      "☢️",
      "☣️",
      "📴",
      "📳",
      "🈶",
      "🈚",
      "🈸",
      "🈺",
      "🈷️",
      "✴️",
      "🆚",
      "💮",
      "🉐",
      "㊙️",
      "㊗️",
      "🈴",
      "🈵",
      "🈹",
      "🈲",
      "🅰️",
      "🅱️",
      "🆎",
      "🆑",
      "🅾️",
      "🆘",
      "❌",
      "⭕",
      "🛑",
      "⛔",
      "📛",
    ],
  },
}

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
  isOpen: boolean
  onClose: () => void
}

export default function EmojiPicker({ onEmojiSelect, isOpen, onClose }: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState<keyof typeof emojiCategories>("smileys")

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[200] bg-transparent" onClick={onClose} />

      {/* Emoji Picker Modal */}
      <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-gray-800 border border-gray-600 rounded-xl shadow-2xl pointer-events-auto w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
          {/* Header - Fixed */}
          <div className="flex items-center justify-between p-4 border-b border-gray-600 flex-shrink-0">
            <h3 className="text-white font-semibold text-lg">Add Emoji</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors duration-200 text-xl p-1 hover:bg-gray-700 rounded"
            >
              ×
            </button>
          </div>

          {/* Category Tabs - Fixed */}
          <div className="flex border-b border-gray-600 p-3 flex-shrink-0 overflow-x-auto">
            {Object.entries(emojiCategories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key as keyof typeof emojiCategories)}
                className={`px-4 py-2 text-sm rounded-lg transition-colors duration-200 whitespace-nowrap flex-shrink-0 ${
                  activeCategory === key
                    ? "bg-[#FF6B35] text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
              >
                {category.name.split(" ")[0]}
              </button>
            ))}
          </div>

          {/* Emoji Grid - Scrollable */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-4">
              <div className="grid grid-cols-8 sm:grid-cols-10 gap-2">
                {emojiCategories[activeCategory].emojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      onEmojiSelect(emoji)
                      onClose()
                    }}
                    className="w-10 h-10 flex items-center justify-center text-xl hover:bg-gray-700 rounded transition-colors duration-200 hover:scale-110"
                    title={emoji}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer with quick actions */}
          <div className="p-4 border-t border-gray-600 flex-shrink-0">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">{emojiCategories[activeCategory].emojis.length} emojis</span>
              <div className="flex space-x-2">
                {["😀", "❤️", "👍", "🎉", "🔥"].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      onEmojiSelect(emoji)
                      onClose()
                    }}
                    className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-700 rounded transition-colors duration-200"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
