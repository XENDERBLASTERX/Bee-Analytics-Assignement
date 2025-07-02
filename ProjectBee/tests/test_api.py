import requests

BASE_URL = "http://127.0.0.1:8000"

def test_upload_csv():
    files = {'file': open('sample.csv', 'rb')}
    r = requests.post(f"{BASE_URL}/upload-csv", files=files)
    print(r.json())

def test_get_data():
    r = requests.get(f"{BASE_URL}/data")
    print(r.json())

def test_get_data_by_id():
    r = requests.get(f"{BASE_URL}/data/1")
    print(r.json())

if __name__ == "__main__":
    test_upload_csv()
    test_get_data()
    test_get_data_by_id()
