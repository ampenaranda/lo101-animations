#!/usr/bin/env python3
"""(Nov 9 night, Ana: "doesn't need lines all the time… just 1, 2, 3, 4. Only the ones that really need a line": a 5th field 1 = draw a line;
every other step shows only its numbered marker.)
LO 101 moment player v3 (Nov 9, 2026). Ana: words on the animation + "show what it means" with lines, like the overlay concepts
(ov_M1_bus_stop / ov_M4_couch_night): module emblem (our Quiver icons), numbered step pills that appear in time, a dashed leader line from
each step to what it means in the scene (target = % of the video frame at that moment), and a summary line. All drawn in code (sharp).
Writes github_repo/index.html. Layouts: ?layout=wide (2.4:1, words left) | phone (video on top, words below, 1:1.15)."""
import json, re
from pathlib import Path
HERE = Path(__file__).resolve().parent; ICONS = HERE.parents[1] / "quiver_icons/clean"
def icon(name):
    s = (ICONS / f"{name}.svg").read_text(); inner = re.sub(r"^.*?<svg[^>]*>|</svg>\s*$", "", s, flags=re.S)
    return re.sub(r'\s*fill="[^"]*"', "", inner).strip()
M = {
 "W":  dict(tag="Welcome", acc="#319EAE", icon="w_wave", alt="A student opens her laptop at the kitchen table and smiles, ready to start",
            steps=[[0.4,"Laptop open",40,70],[2.2,"Tea ready",62,81],[4.0,"Let's begin",54,79]], sum="You pick the hour. The due dates stay."),
 "M1": dict(tag="Module 1 · Know the Terrain", acc="#C9CF4E", icon="m1_compass_star", alt="A student at a bus stop taps her phone and smiles",
            steps=[[2.0,"Alerts on",54,46],[3.6,"Due dates come to you",52,44]], sum="Nothing sneaks up on you, even at the bus stop."),
 "M2": dict(tag="Module 2 · Show Up, Speak Up", acc="#073E51", icon="m2_speech_bubble", alt="A student posts a question on his phone, gets a reply and smiles",
            steps=[[0.4,"Ask a clear question",56,59],[3.6,"Help comes back",36,42,1]], sum="Speaking up online works."),
 "M3": dict(tag="Module 3 · Own Your Week", acc="#E79BC6", icon="m3_flower", alt="A student plans her week in a paper planner and lifts her pen, pleased",
            steps=[[0.4,"Plan your week",62,77],[3.2,"Find your hours",78,33,1]], sum="A plan turns a busy week into hours you can find."),
 "M4": dict(tag="Module 4 · Your Support Crew", acc="#446A5F", icon="m4_sycamore_leaf", alt="A student sees an error on his phone, fixes it on his laptop and leans back, relieved",
            steps=[[0.4,"Screenshot it",73,44],[2.4,"Switch devices",58,76],[4.3,"Send a message",62,80],[6.4,"Breathe",66,66]], sum="Stuck at 10:40 pm? Snap, switch, send."),
 "M5": dict(tag="Module 5 · Try the Tools", acc="#94AE7E", icon="m5_hex_nut", alt="A student watches a lecture on her laptop with headphones and cheers when it clicks",
            steps=[[0.4,"Watch on your time",55,58],[3.4,"Replay until it clicks",77,44]], sum="Lectures wait for you. Pause and replay."),
 "M6": dict(tag="Module 6 · AI: Check Before You Use", acc="#921E0C", icon="m6_shield_spark", alt="Two students read their screens. One looks puzzled, the other raises her hand",
            steps=[[0.4,"Not sure about AI?",41,80],[3.2,"Ask first",80,25]], sum="Each course sets its own AI rule."),
 "M7": dict(tag="Module 7 · Claim It", acc="#D55200", icon="m7_pennant_peak", alt="A student at her laptop throws her arms up and cheers",
            steps=[[0.4,"Plan written",42,78],[3.2,"Badge on its way",43,48]], sum="You're ready to learn online."),
}
BG = {'W': '#F7EEE1', 'M1': '#F5EBE1', 'M2': '#F7EDE3', 'M3': '#F5EBE3', 'M4': '#F5EBE3', 'M5': '#F2E7E0', 'M6': '#F7EFE5', 'M7': '#F7EFE5'}
for k, v in M.items(): v["bg"] = BG[k]; v["svg"] = icon(v.pop("icon"))
html = (HERE / "player_template.html").read_text().replace("/*DATA*/{}", json.dumps(M))
(HERE / "github_repo/index.html").write_text(html)
slim = {k: {kk: v[kk] for kk in ("tag", "alt", "steps", "sum")} for k, v in M.items()}
(HERE.parents[2] / "build/moments.json").write_text(json.dumps(slim, indent=1, ensure_ascii=False)); print("ok", len(html))
