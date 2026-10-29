# ASPIRE: social posts

The LinkedIn and X posts for [`content/writing/aspire-model-services.mdx`](../../content/writing/aspire-model-services.mdx) (calendar #40). Nothing here is part of the site build: Velite reads only `content/writing/**/*.mdx`, and only `public/` is served.

| When | Where | Post | Media |
| --- | --- | --- | --- |
| Tue 17 Nov, about 8:30 am PT | LinkedIn | [linkedin.md](linkedin.md): native video, 54 s, 4:5 | [`aspire-explainer-4x5.mp4`](https://media.nehiljain.dev/aspire-model-services/aspire-explainer-4x5.7885666ebf.mp4), thumbnail `aspire-explainer-thumbnail.png` |
| Wed 18 Nov | X | [x-thread.md](x-thread.md): 7 posts | the same video, `stills/` 05, 06 and 07 |

LinkedIn carries the pictures, so the post stands on its own; the essay link goes in the first comment. X mirrors it a day later.

## Media

The two videos live on R2 at media.nehiljain.dev, not in git. The links download them.

- [`aspire-explainer-4x5.mp4`](https://media.nehiljain.dev/aspire-model-services/aspire-explainer-4x5.7885666ebf.mp4): the essay as one video, 1080 x 1350, 30 fps, no voice. Seven scenes: the cover with the run at 4.4x, how ASPIRE learns, the split, the run at 1.5x with its service calls lit in order, many sims and one copy of each service, the split on Ray, and batching with fractional GPUs. Every speed-up is labelled on screen.
- `aspire-explainer-thumbnail.png`: the cover frame, to upload as the LinkedIn thumbnail.
- `stills/scene-0N-*.png`: each scene's last frame, for X.
- [`aspire-run-4x5.mp4`](https://media.nehiljain.dev/aspire-model-services/aspire-run-4x5.6284e9a356.mp4): the run scene alone, 16 s, for replies.

The look is the site's dark mode (Macchiato, peach #f5a97f, Geist, the nj mark). The run is ASPIRE's example program `examples/libero/object_swap_seed1.py` on one L4. Its step times come from a motion trace of the recording; the sim doesn't step while a service call runs, so the video holds a frame there and says so. That example uses PyRoki for IK and never calls cuRobo.
