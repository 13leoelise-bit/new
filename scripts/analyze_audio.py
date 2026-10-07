"""Extract tempo, beats and onsets from an audio file as JSON for syncing animation.

Usage: python scripts/analyze_audio.py <audio> [out.json]
"""
import json
import sys

import librosa
import numpy as np


def analyze(path):
    y, sr = librosa.load(path, sr=None, mono=True)
    tempo, beats = librosa.beat.beat_track(y=y, sr=sr)
    onsets = librosa.onset.onset_detect(y=y, sr=sr, units="time")
    rms = librosa.feature.rms(y=y)[0]
    return {
        "duration": float(librosa.get_duration(y=y, sr=sr)),
        "tempo": float(np.atleast_1d(tempo)[0]),
        "beats": librosa.frames_to_time(beats, sr=sr).round(3).tolist(),
        "onsets": np.round(onsets, 3).tolist(),
        "rms_peak": float(rms.max()),
    }


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    result = json.dumps(analyze(sys.argv[1]), indent=2)
    if len(sys.argv) > 2:
        open(sys.argv[2], "w").write(result)
    else:
        print(result)
