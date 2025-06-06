#!/usr/bin/env bash
pip install --upgrade pip
pip install sqlalchemy==2.0.28
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port $PORT 