import { FormEvent, useRef, useState } from "react";
import { Button, Col, Form, Row, Stack, Tab } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import CreateableReactSelect from "react-select/creatable"
import { NoteData, Tag } from "./App";
import { v4 as uuidV4 } from "uuid"

type NoteFormProps = {
  onSubmit: (data: NoteData) => void
  onAddTag: (tag: Tag) => void
  availableTags: Tag[]
} & Partial<NoteData>  // Partial make all properties in NoteData optional

export function NoteForm({ onSubmit, onAddTag, availableTags, title = "", markdown = "", tags = [] }: NoteFormProps) {

  const titleRef = useRef<HTMLInputElement>(null)
  const markdownRef = useRef<HTMLTextAreaElement>(null)
  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags)
  const navigate = useNavigate() // custom hook

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    onSubmit({
      title: titleRef.current!.value, // using '!' because a required cannot be null
      markdown: markdownRef.current!.value, // using '!' because a required cannot be null
      tags: selectedTags
    })

    navigate("..")
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Stack gap={4}>

        <Row>
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control ref={titleRef} required defaultValue={title} />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <CreateableReactSelect
                isMulti
                options={availableTags.map(tag => {
                  return { label: tag.label, value: tag.id }
                })}
                // convert each tag to label and value for a select
                value={selectedTags.map(tag => {
                  return {
                    label: tag.label,
                    value: tag.id
                  }
                })}
                onChange={tags => {
                  // convert each tag to label and id
                  setSelectedTags(tags.map(tag => {
                    return {
                      label: tag.label,
                      id: tag.value
                    }
                  }))
                }}
                onCreateOption={label => {
                  const newTag = { id: uuidV4(), label }
                  onAddTag(newTag)
                  setSelectedTags(prev => [...prev, newTag])
                }}

              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="markdown">
          <Form.Label>Body</Form.Label>
          <Form.Control
            ref={markdownRef}
            required
            as="textarea"
            rows={15}
            defaultValue={markdown}
          />
        </Form.Group>

        <Stack direction="horizontal" gap={4} className="justify-content-end">
          <Button type="submit" variant="primary">Save</Button>
          <Link to="..">
            <Button type="button" variant="outline-secondary">Cancel</Button>
          </Link>
        </Stack>

      </Stack>
    </Form>

  )
}