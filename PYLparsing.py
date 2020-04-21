# -*- coding: utf-8 -*-
"""
Created on Thu Apr 16 09:46:23 2020

@author: fhfonsecaa
"""

import csv

filePLY_path = 'filePLY.csv'
vertices_file_path = 'vertices_file.csv'

with open(filePLY_path) as csv_read_file:
    csv_reader = csv.reader(csv_read_file, delimiter=' ')
    with open(vertices_file_path,'w', newline='') as csv_write_file:
        csv_writer = csv.writer(csv_write_file, delimiter=' ')
        for row in csv_reader:
            print(row[0],row[1],row[2])
            csv_writer.writerow(['vec4( {}, {}, {}, {}),'.format(row[0],row[2],row[1],1)])
