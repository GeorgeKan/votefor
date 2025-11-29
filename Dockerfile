FROM golang:alpine AS builder

RUN apk update
RUN apk add alpine-sdk

WORKDIR /src

COPY go* .

RUN go mod download

COPY . .

RUN go build -o fiberapp .


FROM alpine:latest

RUN apk update

RUN addgroup appuser
RUN adduser -S appuser
RUN addgroup appuser appuser

RUN mkdir /fiber
COPY --from=builder /src/fiberapp /fiber


#COPY --from=builder /src/fiberapp /bin/

RUN chown -R appuser:appuser /fiber
RUN chown appuser:appuser /fiber/fiberapp

USER appuser


EXPOSE 3000


WORKDIR /fiber

CMD ["./fiberapp"]

#ENTRYPOINT ["/bin/fiberapp"]
