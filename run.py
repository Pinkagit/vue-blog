#!/usr/bin/env python
# coding=utf-8

#nohup ./node_modules/.bin/runkoa bin/porsche > out.file 2>&1 &

import os
import sys

def do_action(action):
    if action == 'build':
        build()
    pass

def build():
    print(">> --- before build, make sure install necessary packages")
    print(">> --- cd static/vue-blog/")
    print(">> --- npm install")
    os.chdir('static/vue-blog/')
    os.system("npm run build")

if __name__ == "__main__":
    opt = sys.argv
    print(">>>> -------------------------------------------")
    if len(opt) == 1:
        print("Usage: ")
        print("python run.py [cmd:build]")
        exit()

    action = opt[1]
    do_action(action)
    print("<<<< -------------------------------------------")
