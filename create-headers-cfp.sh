#!/bin/bash

cat >> ./public/_headers << 'END'
https://:project.pages.dev/*
  X-Robots-Tag: noindex
END

