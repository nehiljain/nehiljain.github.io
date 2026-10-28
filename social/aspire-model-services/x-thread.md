# X thread (Wed 18 Nov)

Seven posts that follow the LinkedIn post's order and rhythm, cut to X's limit. The counts use X's weighting: "•" and "≈" count as 2, and a link counts as 23. All fit in 280 without Premium. The first post carries the video and no link; the link waits for the last post.

**1/** 168 · attach `aspire-explainer-4x5.mp4`

```text
NVIDIA's ASPIRE gets 99% on 80 LIBERO-Pro tasks without gradient descent.

It learns by rewriting code, not weights.

I set it up on one L4 to see what it takes to run.
```

**2/** 256 · use Quote on Jim Fan's v1.0 post, https://x.com/DrJimFan/status/2111128797181567466 (no image)

```text
The loop:
• An agent writes a robot program
• Debugs it in sim on 15 seeds
• Scores it on 50 new seeds
• Keeps verified fixes as skills for the next task

By Runyu Lu, Yubo Wu, Ethan Kou, Haotian Lin and team, led by @yukez, @DrJimFan and Guanzhi Wang.
```

**3/** 270 · attach `stills/scene-05-share.png`

```text
The program never loads a model. It calls three services over HTTP:
• SAM3 finds objects (GPU)
• PyRoki solves inverse kinematics (CPU)
• cuRobo plans collision-free paths (GPU)

Every sim shares one copy of each, "rather than one model loaded per simulator process."
```

**4/** 176 · attach `stills/scene-06-ray.png`

```text
It's the design I pitch for scaling sims.

ASPIRE runs those services by hand. One machine. One copy each. One bash supervisor.

Ray Serve can run the same split on fewer GPUs.
```

**5/** 279 · attach `stills/scene-07-gpu.png`

```text
What Serve adds:
• Batching: queued calls run as one GPU pass, not one at a time.
• Fractional GPUs: SAM3 + cuRobo used 3.8 GB of my L4's 24 GB.
• Autoscaling: copies follow the calls, down to zero.
• Restarts: Serve replaces a dead copy. ASPIRE's supervisor stops all three.
```

**6/** 168

```text
ASPIRE learns by testing code in sims.

More sims per GPU means faster learning.

Next I'm measuring how many sims one copy can feed:
time between calls ÷ time per call
```

**7/** 81

```text
Write-up and code: https://nehiljain.github.io/writing/aspire-model-services

I work at Anyscale, which builds Ray.
```

## After posting

- Reply to replies the same day. On X the thread is the mirror; the replies are the reach.
- When ASPIRE's authors post an update, reply with `aspire-run-4x5.mp4` (the run scene alone, 16 s) and one line on what you ran.
