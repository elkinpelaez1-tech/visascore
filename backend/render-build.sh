#!/usr/bin/env bash

# Instalar dependencias necesarias para Chromium
apt-get update
apt-get install -y chromium

# Instalar dependencias del proyecto
npm install
