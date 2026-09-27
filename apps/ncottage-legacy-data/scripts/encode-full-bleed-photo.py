#!/usr/bin/env python3
import argparse
import os
import subprocess
import sys
import tempfile
from pathlib import Path

DEFAULT_BIN = Path("/tmp/realesrgan-up/realesrgan-ncnn-vulkan")
RELEASE_ZIP = (
    "https://github.com/xinntao/Real-ESRGAN/releases/download/"
    "v0.2.5.0/realesrgan-ncnn-vulkan-20220424-macos.zip"
)


def die(msg: str) -> None:
    print(msg, file=sys.stderr)
    raise SystemExit(1)


def encode(src: Path, dest: Path, bin_path: Path) -> None:
    try:
        from PIL import Image
    except ImportError:
        die("Need Pillow: python3 -m pip install Pillow")

    dest.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="full-bleed-") as tmp:
        png = Path(tmp) / "up.png"
        cmd = [
            str(bin_path),
            "-i",
            str(src),
            "-o",
            str(png),
            "-n",
            "realesrgan-x4plus",
            "-s",
            "4",
            "-f",
            "png",
        ]
        subprocess.run(cmd, check=True, cwd=str(bin_path.parent))
        im = Image.open(png).convert("RGB")
        im.save(dest, "JPEG", quality=94, subsampling=0, optimize=True)
        mb = dest.stat().st_size / 1024 / 1024
        print(f"{dest} {im.size[0]}x{im.size[1]} {mb:.2f}MB")


def main() -> None:
    p = argparse.ArgumentParser(
        description="1280x720 Imagine still -> 5120x2880 JPEG (Real-ESRGAN x4plus, q94 4:4:4)."
    )
    p.add_argument("src", type=Path, help="Source JPEG (Imagine 16:9, 1280x720)")
    p.add_argument("dest", type=Path, help="Output JPEG")
    p.add_argument(
        "--bin",
        type=Path,
        default=Path(os.environ.get("REALESRGAN_BIN", str(DEFAULT_BIN))),
        help=f"realesrgan-ncnn-vulkan binary (default {DEFAULT_BIN})",
    )
    args = p.parse_args()
    src = args.src.expanduser().resolve()
    dest = args.dest.expanduser().resolve()
    bin_path = args.bin.expanduser().resolve()
    if not src.is_file():
        die(f"Missing input: {src}")
    if not bin_path.is_file() or not os.access(bin_path, os.X_OK):
        die(
            "Missing Real-ESRGAN binary.\n"
            f"  curl -fsSL -o /tmp/realesrgan.zip '{RELEASE_ZIP}'\n"
            "  mkdir -p /tmp/realesrgan-up && unzip -o /tmp/realesrgan.zip -d /tmp/realesrgan-up\n"
            "  chmod +x /tmp/realesrgan-up/realesrgan-ncnn-vulkan"
        )
    encode(src, dest, bin_path)


if __name__ == "__main__":
    main()
