import json, requests

def test_all_benchmark_pitches():
    with open("test-data/benchmark_pitches.json") as f:
        pitches = json.load(f)
    for pitch in pitches:
        response = requests.post("http://localhost:8000/research", json=pitch)
        assert response.status_code == 200
        # add checks: does report contain a score? citations? etc.