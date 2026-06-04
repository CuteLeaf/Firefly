#!/usr/bin/env python3
"""
一键下载音乐：搜索 + 下载音频 + 歌词 + 封面 + 自动更新配置
用法: python scripts/download_music.py "歌名" [--dir=输出目录]
"""

import sys, os, json, re
from urllib.request import Request, urlopen, urlretrieve
from urllib.parse import quote
from urllib.error import URLError

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Referer": "https://music.163.com",
}

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_DIR = os.path.join(PROJECT_ROOT, "public", "assets", "music")
CONFIG_FILE = os.path.join(PROJECT_ROOT, "src", "config", "musicConfig.ts")


def fetch_json(url):
    req = Request(url, headers=HEADERS)
    with urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode("utf-8"))


def safe_name(name):
    return re.sub(r'[\/\\?%*:|"<>]', "-", name).replace(" ", "")


def search(keyword):
    url = f"https://music.163.com/api/search/get?s={quote(keyword)}&type=1&limit=10"
    data = fetch_json(url)
    return data.get("result", {}).get("songs", [])


def get_lyric(song_id):
    url = f"https://music.163.com/api/song/lyric?id={song_id}&lv=1"
    data = fetch_json(url)
    return data.get("lrc", {}).get("lyric", "")


def get_song_url(song_id):
    url = f"https://music.163.com/api/song/enhance/player/url?ids=[{song_id}]&br=320000"
    data = fetch_json(url)
    items = data.get("data", [])
    if items and items[0].get("url"):
        return items[0]["url"]
    return None


def get_cover_url(song_id):
    """Get cover by scraping the song web page for og:image."""
    url = f"https://music.163.com/song?id={song_id}"
    try:
        req = Request(url, headers=HEADERS)
        with urlopen(req, timeout=15) as resp:
            html = resp.read().decode("utf-8", errors="ignore")
        match = re.search(r'og:image["\s]+content="([^"]+)"', html)
        if match:
            return match.group(1).replace("http://", "https://")
        match = re.search(r'https://p[1-9]\.music\.126\.net/[^"\s]+\.jpg', html)
        if match:
            return match.group(0)
    except Exception:
        pass
    return ""


def update_config(song_name, artist_name, music_file, cover_file, lrc_file):
    """Update musicConfig.ts with the new song."""
    try:
        with open(CONFIG_FILE, "r", encoding="utf-8") as f:
            content = f.read()

        # Check for duplicate
        if f'"{music_file}"' in content:
            print(f"  Config: Song already exists in config, skipping")
            return False

        music_path = f"/assets/music/{music_file}"
        cover_path = f"/assets/music/cover/{cover_file}" if cover_file else ""
        lrc_path = f"/assets/music/{lrc_file}" if lrc_file else ""

        new_song = (
            "\t\t\t{\n"
            f'\t\t\t\tname: "{song_name}",\n'
            f'\t\t\t\tartist: "{artist_name}",\n'
            f'\t\t\t\turl: "{music_path}",\n'
            f'\t\t\t\tcover: "{cover_path}",\n'
            f'\t\t\t\tlrc: "{lrc_path}",\n'
            "\t\t\t},"
        )

        # Find the closing of the playlist array
        # Look for the last }, followed by \n\t\t], which closes local.playlist
        markers = list(re.finditer(r'(\n\t\t\t\},)\n\t\t\],', content))
        if not markers:
            print("  [!] Could not find playlist end in config file")
            return False
        marker = markers[-1]

        # Insert after the last }, and before \n\t\t],
        # marker.group() = "\n\t\t\t},\n\t\t],"
        # We want to insert between }," and \n\t\t],
        insert_pos = marker.start() + len("\n\t\t\t},")
        new_content = content[:insert_pos] + "\n" + new_song + content[insert_pos:]

        with open(CONFIG_FILE, "w", encoding="utf-8") as f:
            f.write(new_content)

        print(f"  Config: Updated musicConfig.ts")
        return True

    except Exception as e:
        print(f"  [!] Failed to update config: {e}")
        return False


def main():
    args = sys.argv[1:]
    if not args or args[0] in ("-h", "--help"):
        print(__doc__)
        return

    keyword = args[0]
    out_dir = DEFAULT_DIR
    for a in args[1:]:
        if a.startswith("--dir="):
            out_dir = os.path.expanduser(a.split("=", 1)[1])

    os.makedirs(out_dir, exist_ok=True)
    cover_dir = os.path.join(out_dir, "cover")
    os.makedirs(cover_dir, exist_ok=True)

    # Search
    print(f"  Searching: {keyword}")
    songs = search(keyword)
    if not songs:
        print("  No results found.")
        return

    # Display results
    print("\n  Results:")
    for i, s in enumerate(songs[:5]):
        artists = ", ".join(a["name"] for a in s.get("artists", []))
        print(f"  [{i+1}] {s['name']} - {artists or 'Unknown'}")

    # Select
    try:
        idx = int(input("\n  Select [1]: ") or "1")
    except (ValueError, EOFError):
        idx = 1
    selected = songs[idx - 1] if 1 <= idx <= len(songs) else songs[0]

    song_id = selected["id"]
    song_name = selected["name"]
    artist_name = ", ".join(a["name"] for a in selected.get("artists", []))
    sn = safe_name(song_name)

    print(f"\n  Selected: {song_name} - {artist_name}")

    # Download audio
    music_file = ""
    try:
        song_url = get_song_url(song_id)
        if song_url:
            ext = song_url.split(".")[-1].split("?")[0]
            if ext not in ("mp3", "m4a", "flac", "wav"):
                ext = "mp3"
            music_file = f"{sn}.{ext}"
            music_path = os.path.join(out_dir, music_file)
            print(f"  Downloading audio...")
            urlretrieve(song_url, music_path)
            print(f"  Music: {music_file}")
        else:
            print("  [!] Audio requires VIP or is unavailable")
    except Exception as e:
        print(f"  [!] Audio download failed: {e}")

    # Download lyrics
    lrc = ""
    try:
        lrc = get_lyric(song_id)
        if lrc:
            lrc_path = os.path.join(out_dir, f"{sn}.lrc")
            with open(lrc_path, "w", encoding="utf-8") as f:
                f.write(lrc)
            print(f"  Lyrics: {sn}.lrc")
        else:
            print("  [!] No lyrics available")
    except Exception as e:
        print(f"  [!] Lyrics download failed: {e}")

    # Download cover
    cover_file_exists = False
    try:
        cover_url = get_cover_url(song_id)
        if cover_url:
            cover_path = os.path.join(cover_dir, f"{sn}.jpg")
            print(f"  Downloading cover...")
            urlretrieve(cover_url, cover_path)
            print(f"  Cover: cover/{sn}.jpg")
            cover_file_exists = True
        else:
            print("  [!] Cover not available")
    except Exception as e:
        print(f"  [!] Cover download failed: {e}")

    # Summary & auto-update config
    print("\n  ─────────────────────────────────────────")
    if music_file:
        cover_file = f"{sn}.jpg" if cover_file_exists else ""
        lrc_file = f"{sn}.lrc" if lrc else ""
        update_config(song_name, artist_name, music_file, cover_file, lrc_file)

        print(f"  Done! All files saved to public/assets/music/")
        print(f"  Music player config has been updated automatically!")
    else:
        print(f"  Lyrics downloaded. Audio needs manual download.")
        print(f"  1. Download M4A from: https://music.163.com/#/search/m/?s={quote(song_name)}")
        print(f"  2. Save as: public/assets/music/{sn}.m4a")
        print(f"  3. Run: pnpm cli lrc public/assets/music/{sn}.m4a")
    print("  ─────────────────────────────────────────")


if __name__ == "__main__":
    main()
