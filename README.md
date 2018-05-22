# PIDiful

(c) 2018 Gatlin Johnson <gatlin@niltag.net>

# What?

PIDiful is a little toy simulation I made to learn about PID controllers (with a
specific interest in a minimal autopilot algorithm). You can try it out at
[http://niltag.net/pidiful](http://niltag.net/pidiful).

# How does one use it?

You click inside the box to mark a *set point*, and the little ball will try and
fly to it by adjusting its PID error. This in turn adjusts the acceleration.

You can "turn off" the ball by clicking the "Running" checkbox or hitting the
space bar.

# What is going on?

At its heart the ball implements a simple PID controller. Initially the ball
considers itself to be at an origin position `<X, Y>`, with velocity `<0, 0>`
and acceleration `<0, 0>`. A second position vector is stored as well: the last
position the ball *believed* it was at.

When a set point is marked at position `<X', Y'>`, the error signal is set to
`<X' - X, Y' - Y>`. A correction vector is computed from this and the last
believed position, which is added to the acceleration.

The current position is stored as the last believed position and then updated
using the current believed velocity.

Finally, an average acceleration is computed incorporating drag and gravity and
used to update the velocity.

There's plenty of room for improvement but I think it's neat.

# Questions / Comments / Free Money

Email me at gatlin@niltag.net. Thanks!
