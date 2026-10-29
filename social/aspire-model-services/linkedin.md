# LinkedIn: video post (Tue 17 Nov, about 8:30 am PT)

Upload [`aspire-explainer-4x5.mp4`](https://media.nehiljain.dev/aspire-model-services/aspire-explainer-4x5.7885666ebf.mp4), then `aspire-explainer-thumbnail.png` as the thumbnail. No captions file: the video has no voice.

## Post

```text
NVIDIA's ASPIRE gets 99% on 80 LIBERO-Pro tasks without gradient descent.

It learns by rewriting code, not weights.

I set it up on Anyscale, on one L4, to see what it takes to run.

The loop:
• An agent writes a robot program
• Debugs it in sim on 15 seeds
• Scores it on 50 new seeds
• Keeps verified fixes as skills for the next task

The program never loads a model. It calls three services over HTTP:
• SAM3 finds objects (GPU)
• PyRoki solves inverse kinematics (CPU)
• cuRobo plans collision-free paths (GPU)

Every sim shares one copy of each, "rather than one model loaded per simulator process."

It's the design I pitch for scaling sims.

ASPIRE runs those services by hand. One machine. One copy each. One bash supervisor.

Ray Serve can run the same split on fewer GPUs:
• Batching: GPU services take one call at a time. Serve runs the queue as one pass.
• Fractional GPUs: SAM3 and cuRobo used 3.8 GB of my L4's 24 GB. Serve packs them beside the sims.
• Autoscaling: copies follow the calls, down to zero between runs.
• Restarts: Serve replaces a dead copy. ASPIRE's supervisor stops all three.

ASPIRE learns by testing code in sims.

More sims per GPU means faster learning.

Next I'm measuring how many sims one copy can feed:
time between calls ÷ time per call

ASPIRE is by Runyu Lu, Yubo Wu, Ethan Kou, Haotian Lin and colleagues at NVIDIA GEAR, UMich, UIUC, UC Berkeley and CMU. Write-up and code in the first comment.

#Robotics #PhysicalAI #DistributedComputing
```

**Tags:** type @ and pick Runyu Lu, Jim Fan and Yuke Zhu (project leads with Guanzhi Wang). Leave a name as text if it doesn't come up in the picker.

## First comment

Post it yourself right after:

```text
The write-up, with ASPIRE's code and the Ray Serve sketch: https://nehiljain.github.io/writing/aspire-model-services
Paper: https://arxiv.org/abs/2607.00272 · Code: https://github.com/NVlabs/ASPIRE
```

Then reply to every comment in the first hour.

## Format check (Founder OS and Ship 30)

| Rule | Source | In the post |
| --- | --- | --- |
| First 3 lines: curiosity, then a pull, then a promise of value | Founder OS | "99% ... without gradient descent" / "rewriting code, not weights" / "to see what it takes to run" |
| One short line per paragraph, white space between ideas | Founder OS, Ship 30 | Every idea is its own paragraph |
| Bullets for any series | Ship 30, Founder OS | The loop, the three services, what Serve adds |
| Each section opens with a one-sentence door (1/3/1, 1/4/1) | Ship 30 | "The loop:", "The program never loads a model.", "Ray Serve can run the same split on fewer GPUs:" |
| Staccato for data | Ship 30 | "One machine. One copy each. One bash supervisor." |
| One-liner punches and contrast pairs | Ship 30 | "It's the design I pitch for scaling sims." / the two lines on testing code and faster learning |
| Implicit CTA: the reader runs their own numbers | Ship 30 | The formula on its own line |
| End on the next test, never on a product | Playbook | Ends on the next measurement, then credit; Ray sits in the middle |
| About 250 words; no emojis, em dashes, semicolons or hedges | Ship 30 | 253 words with the credit line |
| Left out on purpose | Playbook | Founder OS's "repost and follow" footer and the 45-minute engagement group |

One exception: 99% is ASPIRE's own number (its README: "99% success on 80 LIBERO-Pro Goal / Object / Spatial / Long tasks"), not one the reader can derive in the post. It stays because it's the essay's hook and it's credited.

## Sources

- My run: ASPIRE's example program on one L4, success in 27 s; SAM3 and cuRobo used 3.8 GB of the L4's 24 GB
- ASPIRE README: the 99% line, and "'training' is skill refinement instead of gradient descent"
- ASPIRE's code: "rather than one model loaded per simulator process" (`src/cap_harness/providers/service_runtime.py`); the supervisor (`scripts/supervise_services.sh`)
- Serve's features are read from its docs and mapped onto ASPIRE's code, not measured
